package com.acadprobot.admin.dto;

import java.time.LocalDateTime;
import java.util.*;

public class UserDTO {
    private UUID userId;
    private String email;
    private LocalDateTime created_at;

    public UserDTO(UUID userId, String email, LocalDateTime created_at) {
        this.userId = userId;
        this.email = email;
        this.created_at = created_at;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

}
