package com.acadprobot.admin.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "admin_chatbot_request")
public class AdminChatbotRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String chatbot_name;

    @Column(nullable = false)
    private String fullname;

    @Column(nullable = false)
    private String department_program;

    @Column(columnDefinition = "TEXT")
    private String purpose;

    @Column(nullable = false)
    private String status = "pending";

    @Column(name = "submitted_at", updatable = false)
    private LocalDateTime submitted_at = LocalDateTime.now();

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public UUID getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getTitle() {
        return title;
    }

    public String getChatbot_name() {
        return chatbot_name;
    }

    public String getDepartment_program() {
        return department_program;
    }

    public String getPurpose() {
        return purpose;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getSubmitted_at() {
        return submitted_at;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setChatbot_name(String chatbot_name) {
        this.chatbot_name = chatbot_name;
    }

    public void setDepartment_program(String department_program) {
        this.department_program = department_program;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setSubmitted_at(LocalDateTime submitted_at) {
        this.submitted_at = submitted_at;
    }
}
