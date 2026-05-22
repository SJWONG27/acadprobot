package com.acadprobot.admin.email.queue;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Binds email queue settings from application properties so queue behavior can be tuned per environment.
 */
@Component
@ConfigurationProperties(prefix = "app.email.queue")
public class EmailQueueProperties {

    private String streamName = "email:queue";
    private String deadLetterStreamName = "email:dead-letter";
    private String consumerGroup = "email-workers";
    private String consumerName = "email-worker";
    private int maxAttempts = 3;
    private int batchSize = 10;
    private long pollDelayMs = 1000;

    public String getStreamName() {
        return streamName;
    }

    public void setStreamName(String streamName) {
        this.streamName = streamName;
    }

    public String getDeadLetterStreamName() {
        return deadLetterStreamName;
    }

    public void setDeadLetterStreamName(String deadLetterStreamName) {
        this.deadLetterStreamName = deadLetterStreamName;
    }

    public String getConsumerGroup() {
        return consumerGroup;
    }

    public void setConsumerGroup(String consumerGroup) {
        this.consumerGroup = consumerGroup;
    }

    public String getConsumerName() {
        return consumerName;
    }

    public void setConsumerName(String consumerName) {
        this.consumerName = consumerName;
    }

    public int getMaxAttempts() {
        return maxAttempts;
    }

    public void setMaxAttempts(int maxAttempts) {
        this.maxAttempts = maxAttempts;
    }

    public int getBatchSize() {
        return batchSize;
    }

    public void setBatchSize(int batchSize) {
        this.batchSize = batchSize;
    }

    public long getPollDelayMs() {
        return pollDelayMs;
    }

    public void setPollDelayMs(long pollDelayMs) {
        this.pollDelayMs = pollDelayMs;
    }
}
