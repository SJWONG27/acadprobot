package com.acadprobot.admin.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Table(name = "unrelated_queries")
public class UnrelatedQueries {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private UUID userId;
    private UUID chatbotId;
    private String queryText;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime created_at = LocalDateTime.now();

    public UUID getId() {
        return id;
    }

    public UUID getUserId() {
        return userId;
    }

    public UUID getChatbotId() {
        return chatbotId;
    }

    public String getQueryText() {
        return queryText;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }
}
