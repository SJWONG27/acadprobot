package com.acadprobot.admin.dto;


public class AuthResponse {
    private String access_token;
    private String token_type;
    private String role;
    private String email;

    public AuthResponse(String access_token, String token_type, String role, String email) {
        this.access_token = access_token;
        this.token_type = token_type;
        this.role = role;
        this.email = email;
    }

    public String getAccess_token() {
        return access_token;
    }

    public String getToken_type() {
        return token_type;
    }

    public String getRole() {
        return role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setAccess_token(String access_token) {
        this.access_token = access_token;
    }

    public void setToken_type(String token_type) {
        this.token_type = token_type;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
