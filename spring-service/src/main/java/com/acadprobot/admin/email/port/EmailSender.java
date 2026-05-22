package com.acadprobot.admin.email.port;

import com.acadprobot.admin.email.queue.EmailQueueMessage;

public interface EmailSender {

    /**
     * Sends an already prepared queue message through the configured mail provider.
     */
    void send(EmailQueueMessage message);
}
