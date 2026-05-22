package com.acadprobot.admin.email.application;

import org.springframework.stereotype.Service;

import com.acadprobot.admin.email.port.EmailQueueClient;
import com.acadprobot.admin.email.queue.EmailQueueMessage;

@Service
public class EmailService {

    private final EmailQueueClient emailQueueClient;

    public EmailService(EmailQueueClient emailQueueClient) {
        this.emailQueueClient = emailQueueClient;
    }

    /**
     * Queues an email for asynchronous delivery so HTTP requests are not blocked by SMTP latency.
     */
    public void sendEmail(String to, String subject, String body) {
        emailQueueClient.publish(EmailQueueMessage.newMessage(to, subject, body));
    }
}
