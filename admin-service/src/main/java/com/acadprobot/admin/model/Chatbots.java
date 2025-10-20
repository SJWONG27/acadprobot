package com.acadprobot.admin.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chatbots")
public class Chatbots {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name = "";

    @Column(name = "refercode", nullable = false, unique = true, length = 6)
    private String refercode;

    @PrePersist
    public void generateRefercode() {
        if (refercode == null || refercode.isEmpty()) {
            refercode = generateRandomCode(6);
        }
    }

    private String generateRandomCode(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    @Column(name = "created_at", updatable = false)
    private LocalDateTime created_at = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    @JsonBackReference // only go from Admin → Users, not the other way around.
    private Admin admin;

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getRefercode() {
        return refercode;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public Admin getAdmin() {
        return admin;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setRefercode(String refercode) {
        this.refercode = refercode;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    public void setAdmin(Admin admin) {
        this.admin = admin;
    }
}
