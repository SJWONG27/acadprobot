package com.acadprobot.admin.email.queue;

public record EmailQueueEnvelope(
        String messageId,
        EmailQueueMessage message
) {
}
