package com.acadprobot.admin.email.infrastructure;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;

import java.time.Instant;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import com.acadprobot.admin.email.queue.EmailQueueMessage;

@ExtendWith(MockitoExtension.class)
class SpringMailEmailSenderTest {

    @Mock
    private JavaMailSender mailSender;

    private SpringMailEmailSender emailSender;

    @BeforeEach
    void setUp() {
        emailSender = new SpringMailEmailSender(mailSender);
    }

    @Test
    void sendConvertsQueueMessageToSimpleMailMessage() {
        EmailQueueMessage message = new EmailQueueMessage(
                "user@example.com",
                "Subject",
                "Body",
                0,
                Instant.now()
        );

        emailSender.send(message);

        ArgumentCaptor<SimpleMailMessage> mailCaptor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(mailCaptor.capture());
        assertEquals("user@example.com", mailCaptor.getValue().getTo()[0]);
        assertEquals("Subject", mailCaptor.getValue().getSubject());
        assertEquals("Body", mailCaptor.getValue().getText());
    }
}
