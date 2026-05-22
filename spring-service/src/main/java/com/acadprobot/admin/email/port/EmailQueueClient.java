package com.acadprobot.admin.email.port;

import java.util.List;

import com.acadprobot.admin.email.queue.EmailQueueEnvelope;
import com.acadprobot.admin.email.queue.EmailQueueMessage;

public interface EmailQueueClient {

    /**
     * Publishes a new email message to the primary queue.
     */
    void publish(EmailQueueMessage message);

    /**
     * Requeues a failed message that still has retry attempts remaining.
     */
    void publishRetry(EmailQueueMessage message);

    /**
     * Stores an exhausted message for later inspection instead of dropping it.
     */
    void publishDeadLetter(EmailQueueMessage message, String lastError);

    /**
     * Reads a bounded batch of messages assigned to this worker.
     */
    List<EmailQueueEnvelope> readBatch();

    /**
     * Confirms that a queue message was handled and should not be redelivered.
     */
    void acknowledge(String messageId);

    /**
     * Ensures the queue consumer group exists before workers start polling.
     */
    boolean ensureConsumerGroup();
}
