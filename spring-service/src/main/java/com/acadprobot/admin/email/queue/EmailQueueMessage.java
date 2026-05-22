package com.acadprobot.admin.email.queue;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

public record EmailQueueMessage(
        String to,
        String subject,
        String body,
        int attempts,
        Instant createdAt
) {

    /**
     * Creates the first queue payload for an email that has not been attempted yet.
     */
    public static EmailQueueMessage newMessage(String to, String subject, String body) {
        return new EmailQueueMessage(to, subject, body, 0, Instant.now());
    }

    /**
     * Rehydrates a queue payload from Redis stream fields.
     */
    public static EmailQueueMessage fromMap(Map<?, ?> values) {
        return new EmailQueueMessage(
                asString(values.get("to")),
                asString(values.get("subject")),
                asString(values.get("body")),
                parseAttempts(asString(values.get("attempts"))),
                parseCreatedAt(asString(values.get("createdAt")))
        );
    }

    /**
     * Serializes the payload into Redis stream fields.
     */
    public Map<String, String> toMap() {
        Map<String, String> values = new HashMap<>();
        values.put("to", to);
        values.put("subject", subject);
        values.put("body", body);
        values.put("attempts", String.valueOf(attempts));
        values.put("createdAt", createdAt.toString());
        return values;
    }

    /**
     * Returns the same email payload with its retry attempt count advanced.
     */
    public EmailQueueMessage nextAttempt() {
        return new EmailQueueMessage(to, subject, body, attempts + 1, createdAt);
    }

    private static int parseAttempts(String attempts) {
        if (attempts == null || attempts.isBlank()) {
            return 0;
        }
        return Integer.parseInt(attempts);
    }

    private static Instant parseCreatedAt(String createdAt) {
        if (createdAt == null || createdAt.isBlank()) {
            return Instant.now();
        }
        return Instant.parse(createdAt);
    }

    private static String asString(Object value) {
        return value == null ? null : value.toString();
    }
}
