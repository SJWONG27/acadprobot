package com.acadprobot.admin.email.queue;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.acadprobot.admin.email.port.EmailQueueClient;
import com.acadprobot.admin.email.port.EmailSender;

@ExtendWith(MockitoExtension.class)
class EmailQueueConsumerTest {

    @Mock
    private EmailQueueClient emailQueueClient;

    @Mock
    private EmailSender emailSender;

    private EmailQueueConsumer consumer;
    private EmailQueueProperties queueProperties;

    @BeforeEach
    void setUp() {
        queueProperties = new EmailQueueProperties();
        queueProperties.setStreamName("email:queue");
        queueProperties.setDeadLetterStreamName("email:dead-letter");
        queueProperties.setConsumerGroup("email-workers");
        queueProperties.setConsumerName("email-worker-test");
        queueProperties.setMaxAttempts(3);
        queueProperties.setBatchSize(10);

        when(emailQueueClient.ensureConsumerGroup()).thenReturn(true);
        consumer = new EmailQueueConsumer(emailQueueClient, queueProperties, emailSender);
    }

    @Test
    void processQueuedEmailsSendsAndAcknowledgesMessage() {
        EmailQueueEnvelope queuedEmail = emailEnvelope("1-0", 0);
        when(emailQueueClient.readBatch()).thenReturn(List.of(queuedEmail));

        consumer.processQueuedEmails();

        verify(emailSender).send(queuedEmail.message());
        verify(emailQueueClient).acknowledge("1-0");
    }

    @Test
    void processQueuedEmailsMovesExhaustedFailuresToDeadLetterStream() {
        EmailQueueEnvelope queuedEmail = emailEnvelope("1-0", 2);
        when(emailQueueClient.readBatch()).thenReturn(List.of(queuedEmail));
        doThrow(new RuntimeException("SMTP unavailable")).when(emailSender).send(queuedEmail.message());

        consumer.processQueuedEmails();

        ArgumentCaptor<EmailQueueMessage> messageCaptor = ArgumentCaptor.forClass(EmailQueueMessage.class);
        verify(emailQueueClient).publishDeadLetter(messageCaptor.capture(), eq("SMTP unavailable"));
        verify(emailQueueClient).acknowledge("1-0");

        EmailQueueMessage deadLetterMessage = messageCaptor.getValue();
        assertEquals(3, deadLetterMessage.attempts());
        assertEquals("user@example.com", deadLetterMessage.to());
    }

    @Test
    void processQueuedEmailsRequeuesRetryableFailures() {
        EmailQueueEnvelope queuedEmail = emailEnvelope("1-0", 1);
        when(emailQueueClient.readBatch()).thenReturn(List.of(queuedEmail));
        doThrow(new RuntimeException("SMTP unavailable")).when(emailSender).send(queuedEmail.message());

        consumer.processQueuedEmails();

        ArgumentCaptor<EmailQueueMessage> messageCaptor = ArgumentCaptor.forClass(EmailQueueMessage.class);
        verify(emailQueueClient).publishRetry(messageCaptor.capture());
        verify(emailQueueClient).acknowledge("1-0");

        assertEquals(2, messageCaptor.getValue().attempts());
    }

    private EmailQueueEnvelope emailEnvelope(String messageId, int attempts) {
        return new EmailQueueEnvelope(
                messageId,
                new EmailQueueMessage(
                        "user@example.com",
                        "Subject",
                        "Body",
                        attempts,
                        Instant.now()
                )
        );
    }
}
