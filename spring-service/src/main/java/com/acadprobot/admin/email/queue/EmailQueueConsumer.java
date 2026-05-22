package com.acadprobot.admin.email.queue;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.acadprobot.admin.email.port.EmailQueueClient;
import com.acadprobot.admin.email.port.EmailSender;

@Service
@ConditionalOnProperty(prefix = "app.email.queue", name = "enabled", havingValue = "true", matchIfMissing = true)
public class EmailQueueConsumer {

    private static final Logger logger = LoggerFactory.getLogger(EmailQueueConsumer.class);

    private final EmailQueueClient emailQueueClient;
    private final EmailQueueProperties queueProperties;
    private final EmailSender emailSender;

    public EmailQueueConsumer(
            EmailQueueClient emailQueueClient,
            EmailQueueProperties queueProperties,
            EmailSender emailSender
    ) {
        this.emailQueueClient = emailQueueClient;
        this.queueProperties = queueProperties;
        this.emailSender = emailSender;
    }

    /**
     * Polls the queue on a fixed delay and processes each message independently.
     */
    @Scheduled(fixedDelayString = "${app.email.queue.poll-delay-ms:2000}")
    public void processQueuedEmails() {
        // Redis Streams require the consumer group before messages can be assigned to this worker.
        if (!emailQueueClient.ensureConsumerGroup()) {
            return;
        }

        List<EmailQueueEnvelope> queuedEmails = emailQueueClient.readBatch();

        if (queuedEmails.isEmpty()) {
            return;
        }

        logger.info("Picked up {} queued email(s) for processing", queuedEmails.size());

        for (EmailQueueEnvelope queuedEmail : queuedEmails) {
            processEmail(queuedEmail);
        }
    }

    private void processEmail(EmailQueueEnvelope queuedEmail) {
        try {
            emailSender.send(queuedEmail.message());
            emailQueueClient.acknowledge(queuedEmail.messageId());
            logger.info("Sent queued email {} to {}", queuedEmail.messageId(), queuedEmail.message().to());
        } catch (Exception ex) {
            handleFailure(queuedEmail, ex);
        }
    }

    private void handleFailure(EmailQueueEnvelope queuedEmail, Exception ex) {
        EmailQueueMessage message = queuedEmail.message();
        EmailQueueMessage nextAttempt = message.nextAttempt();

        // Failed messages are either retried or preserved in dead-letter storage for manual follow-up.
        if (nextAttempt.attempts() >= queueProperties.getMaxAttempts()) {
            emailQueueClient.publishDeadLetter(nextAttempt, ex.getMessage());
        } else {
            emailQueueClient.publishRetry(nextAttempt);
            logger.warn("Requeued email {} for {}, attempt {}/{}",
                    queuedEmail.messageId(),
                    message.to(),
                    nextAttempt.attempts(),
                    queueProperties.getMaxAttempts()
            );
        }

        emailQueueClient.acknowledge(queuedEmail.messageId());
        logger.warn("Email send failed for {}, attempt {}/{}: {}",
                message.to(),
                nextAttempt.attempts(),
                queueProperties.getMaxAttempts(),
                ex.getMessage()
        );
    }
}
