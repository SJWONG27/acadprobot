package com.acadprobot.admin.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.UUID;
import java.util.Objects;

@Embeddable
public class UserChatbotID implements Serializable{

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "chatbot_id")
    private UUID chatbotId;

    // Constructors
    public UserChatbotID() {}
    public UserChatbotID(UUID userId, UUID chatbotId) {
        this.userId = userId;
        this.chatbotId = chatbotId;
    }

    // Getters & Setters
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public UUID getChatbotId() { return chatbotId; }
    public void setChatbotId(UUID chatbotId) { this.chatbotId = chatbotId; }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserChatbotID)) return false;
        UserChatbotID that = (UserChatbotID) o;
        return Objects.equals(userId, that.userId) &&
                Objects.equals(chatbotId, that.chatbotId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, chatbotId);
    }
}
