package com.acadprobot.admin.model;

import com.acadprobot.admin.model.User;
import com.acadprobot.admin.model.Chatbots;
import jakarta.persistence.*;
import java.util.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "user_chatbots")
public class UserChatbots {

    @EmbeddedId
    private UserChatbotID id;

    @ManyToOne
    @MapsId("userId")  // refers to 'userId' in embedded ID
    @JoinColumn(name = "user_id", referencedColumnName = "id")  // FK column in user_chatbots → PK column in users
    private User user;

    @ManyToOne
    @MapsId("chatbotId") // refers to 'chatbotId' in embedded ID
    @JoinColumn(name = "chatbot_id", referencedColumnName = "id") // FK column in user_chatbots → PK column in chatbots
    private Chatbots chatbot;

    @Column(name = "joined_at", updatable = false)
    private LocalDateTime joined_at = LocalDateTime.now();

    public UserChatbots() {}
    public UserChatbots(UserChatbotID id) {
        this.id = id;
    }

    public UserChatbotID getId() {
        return id;
    }

    public void setId(UserChatbotID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Chatbots getChatbot() {
        return chatbot;
    }

    public void setChatbot(Chatbots chatbot) {
        this.chatbot = chatbot;
    }

    public LocalDateTime getJoined_at() {
        return joined_at;
    }

//    public void setUserId(UUID userId) {
//        this.userId = userId;
//    }
//
//    public void setChatbotId(UUID chatbotId) {
//        this.chatbotId = chatbotId;
//    }

    public void setJoined_at(LocalDateTime joined_at) {
        this.joined_at = joined_at;
    }
}
