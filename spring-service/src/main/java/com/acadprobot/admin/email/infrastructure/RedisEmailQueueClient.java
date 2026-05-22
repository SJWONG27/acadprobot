package com.acadprobot.admin.email.infrastructure;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.RedisSystemException;
import org.springframework.data.redis.connection.stream.Consumer;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.connection.stream.ReadOffset;
import org.springframework.data.redis.connection.stream.RecordId;
import org.springframework.data.redis.connection.stream.StreamOffset;
import org.springframework.data.redis.connection.stream.StreamReadOptions;
import org.springframework.data.redis.connection.stream.StreamRecords;
import org.springframework.data.redis.core.StreamOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import com.acadprobot.admin.email.port.EmailQueueClient;
import com.acadprobot.admin.email.queue.EmailQueueEnvelope;
import com.acadprobot.admin.email.queue.EmailQueueMessage;
import com.acadprobot.admin.email.queue.EmailQueueProperties;

@Component
public class RedisEmailQueueClient implements EmailQueueClient {

    private static final Logger logger = LoggerFactory.getLogger(RedisEmailQueueClient.class);
    private static final String INIT_RECORD_TYPE = "init";
    private static final String RECORD_TYPE_KEY = "_type";

    private final StringRedisTemplate redisTemplate;
    private final EmailQueueProperties queueProperties;

    private volatile boolean consumerGroupReady;

    public RedisEmailQueueClient(StringRedisTemplate redisTemplate, EmailQueueProperties queueProperties) {
        this.redisTemplate = redisTemplate;
        this.queueProperties = queueProperties;
    }

    /**
     * Writes a new email payload to the Redis stream used by email workers.
     */
    @Override
    public void publish(EmailQueueMessage message) {
        RecordId recordId = addToStream(queueProperties.getStreamName(), message.toMap());
        logger.info("Queued email {} for {}", recordId.getValue(), message.to());
    }

    /**
     * Writes a retry payload back to the primary Redis stream with the updated attempt count.
     */
    @Override
    public void publishRetry(EmailQueueMessage message) {
        RecordId recordId = addToStream(queueProperties.getStreamName(), message.toMap());
        logger.info("Queued email retry {} for {}, attempt {}/{}",
                recordId.getValue(),
                message.to(),
                message.attempts(),
                queueProperties.getMaxAttempts()
        );
    }

    /**
     * Writes permanently failed messages to the dead-letter stream with the last observed error.
     */
    @Override
    public void publishDeadLetter(EmailQueueMessage message, String lastError) {
        Map<String, String> payload = new HashMap<>(message.toMap());
        payload.put("lastError", lastError);

        RecordId recordId = addToStream(queueProperties.getDeadLetterStreamName(), payload);
        logger.warn("Moved email {} for {} to dead-letter stream: {}",
                recordId.getValue(),
                message.to(),
                lastError
        );
    }

    /**
     * Reads messages assigned to this consumer group and skips internal initialization records.
     */
    @Override
    @SuppressWarnings("unchecked")
    public List<EmailQueueEnvelope> readBatch() {
        List<MapRecord<String, Object, Object>> records = streamOperations().read(
                Consumer.from(queueProperties.getConsumerGroup(), queueProperties.getConsumerName()),
                StreamReadOptions.empty().count(queueProperties.getBatchSize()),
                StreamOffset.create(queueProperties.getStreamName(), ReadOffset.lastConsumed())
        );

        if (records == null || records.isEmpty()) {
            return List.of();
        }

        List<EmailQueueEnvelope> messages = new ArrayList<>();
        for (MapRecord<String, Object, Object> record : records) {
            Map<Object, Object> values = record.getValue();

            if (INIT_RECORD_TYPE.equals(values.get(RECORD_TYPE_KEY))) {
                acknowledge(record.getId().getValue());
                continue;
            }

            messages.add(new EmailQueueEnvelope(
                    record.getId().getValue(),
                    EmailQueueMessage.fromMap(values)
            ));
        }

        return messages;
    }

    /**
     * Acknowledges successful handling so Redis does not keep the message pending.
     */
    @Override
    public void acknowledge(String messageId) {
        streamOperations().acknowledge(
                queueProperties.getStreamName(),
                queueProperties.getConsumerGroup(),
                RecordId.of(messageId)
        );
    }

    /**
     * Creates the Redis consumer group once and treats an existing group as ready.
     */
    @Override
    public boolean ensureConsumerGroup() {
        if (consumerGroupReady) {
            return true;
        }

        try {
            addToStream(queueProperties.getStreamName(), Map.of(RECORD_TYPE_KEY, INIT_RECORD_TYPE));
            streamOperations().createGroup(
                    queueProperties.getStreamName(),
                    ReadOffset.latest(),
                    queueProperties.getConsumerGroup()
            );
            consumerGroupReady = true;
            return true;
        } catch (RedisSystemException ex) {
            if (isBusyGroupError(ex)) {
                consumerGroupReady = true;
                return true;
            }

            logger.warn("Email queue consumer group is not ready: {}", rootCauseMessage(ex));
            return false;
        } catch (RedisConnectionFailureException ex) {
            logger.warn("Redis is unavailable for email queue processing: {}", ex.getMessage());
            return false;
        }
    }

    /**
     * Adds a record to the selected Redis stream and fails fast if Redis does not return an ID.
     */
    private RecordId addToStream(String streamName, Map<String, String> payload) {
        RecordId recordId = streamOperations().add(
                StreamRecords.newRecord()
                        .ofMap(payload)
                        .withStreamKey(streamName)
        );

        if (recordId == null) {
            throw new IllegalStateException("Failed to publish email queue message to " + streamName);
        }

        return recordId;
    }

    private StreamOperations<String, Object, Object> streamOperations() {
        return redisTemplate.opsForStream();
    }

    /**
     * Detects Redis BUSYGROUP errors, which mean another instance already created the group.
     */
    private boolean isBusyGroupError(Throwable ex) {
        Throwable current = ex;
        while (current != null) {
            String message = current.getMessage();
            if (message != null && message.contains("BUSYGROUP")) {
                return true;
            }
            current = current.getCause();
        }

        return false;
    }

    /**
     * Extracts the deepest Redis exception message for concise operational logs.
     */
    private String rootCauseMessage(Throwable ex) {
        Throwable current = ex;
        String message = ex.getMessage();

        while (current.getCause() != null) {
            current = current.getCause();
            if (current.getMessage() != null) {
                message = current.getMessage();
            }
        }

        return message;
    }
}
