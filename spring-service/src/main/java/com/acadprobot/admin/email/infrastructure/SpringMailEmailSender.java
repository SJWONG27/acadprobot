package com.acadprobot.admin.email.infrastructure;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import com.acadprobot.admin.email.port.EmailSender;
import com.acadprobot.admin.email.queue.EmailQueueMessage;

@Component
public class SpringMailEmailSender implements EmailSender {

    private final JavaMailSender mailSender;

    public SpringMailEmailSender(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Converts the queue payload into Spring's mail message type and delegates delivery.
     */
    @Override
    public void send(EmailQueueMessage message) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(message.to());
        mailMessage.setSubject(message.subject());
        mailMessage.setText(message.body());

        mailSender.send(mailMessage);
    }
}
