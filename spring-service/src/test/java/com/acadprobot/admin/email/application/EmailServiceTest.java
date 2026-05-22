package com.acadprobot.admin.email.application;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.acadprobot.admin.email.port.EmailQueueClient;
import com.acadprobot.admin.email.queue.EmailQueueMessage;

@ExtendWith(MockitoExtension.class)
class EmailServiceTest {

    @Mock
    private EmailQueueClient emailQueueClient;

    private EmailService emailService;

    @BeforeEach
    void setUp() {
        emailService = new EmailService(emailQueueClient);
    }

    @Test
    void sendEmailPublishesEmailQueueMessage() {
        emailService.sendEmail("user@example.com", "Subject", "Body");

        ArgumentCaptor<EmailQueueMessage> messageCaptor = ArgumentCaptor.forClass(EmailQueueMessage.class);
        verify(emailQueueClient).publish(messageCaptor.capture());

        EmailQueueMessage queuedMessage = messageCaptor.getValue();
        assertEquals("user@example.com", queuedMessage.to());
        assertEquals("Subject", queuedMessage.subject());
        assertEquals("Body", queuedMessage.body());
        assertEquals(0, queuedMessage.attempts());
        assertNotNull(queuedMessage.createdAt());
    }
}
