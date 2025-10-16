package com.acadprobot.admin.controller;
import com.acadprobot.admin.model.User;
import com.acadprobot.admin.service.AuthService;
import com.acadprobot.admin.dto.AuthResponse;
import com.acadprobot.admin.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public User register(@RequestBody Map<String, String> body){
        System.out.println("Request body: " + body);
        try {
            return authService.registerUser(body.get("email"), body.get("password"), body.get("refercode"));
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body){
        try{
            String email = body.get("email");
            String password = body.get("password");

            AuthResponse authResponse = authService.login(email, password);
            return ResponseEntity.ok(Map.of(
                    "access_token", authResponse.getAccess_token(),
                    "token_type", authResponse.getToken_type(),
                    "role", authResponse.getRole()
            ));
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }

    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            var claims = jwtUtil.validateToken(token).getBody();

            return ResponseEntity.ok(Map.of(
                    "id", claims.getSubject(),
                    "role", claims.get("role")
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }
    }

}
