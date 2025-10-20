package com.acadprobot.admin.service;
import com.acadprobot.admin.model.Admin;
import com.acadprobot.admin.model.User;
import com.acadprobot.admin.repository.AdminRepository;
import com.acadprobot.admin.repository.UserRepository;
import com.acadprobot.admin.security.JwtUtil;
import com.acadprobot.admin.dto.AuthResponse;
import com.acadprobot.admin.config.SecurityConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // registration
    public User registerUser(String email, String password){

        Optional<User> existingUser = userRepository.findByEmail(email);
        Optional<Admin> existingAdmin = adminRepository.findByEmail(email);
        System.out.println("🔍 existingUser: " + existingUser);
        System.out.println("🔍 existingAdmin: " + existingAdmin);

        if (existingAdmin.isPresent() || existingUser.isPresent()) {
            throw new RuntimeException("Email already registered");
        }


        String hashedPassword = passwordEncoder.encode(password);
        System.out.println("✅ Password hashed");

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(hashedPassword);

        User savedUser = userRepository.save(newUser);
        System.out.println("✅ User saved successfully: " + savedUser.getId());

        return savedUser;
    }



    public AuthResponse login(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() ) {
            if (passwordEncoder.matches(password, user.get().getPassword())) {
                String token = jwtUtil.generateToken(Map.of(
                        "sub", user.get().getId().toString(),
                        "role", "user",
                        "email", email
                ));
                return new AuthResponse(token, "bearer", "user", email);
            } else {
                throw new RuntimeException("Invalid credentials wrong password");
            }
        }

        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            if (passwordEncoder.matches(password, admin.get().getPassword())) {
                String token = jwtUtil.generateToken(Map.of(
                        "sub", admin.get().getId().toString(),
                        "role", "admin",
                        "email", email
                ));
                    return new AuthResponse(token, "bearer", "admin", email);
            } else {
                throw new RuntimeException("Invalid credentials wrong password");
            }
        }

        throw new RuntimeException("Invalid credentials email not found");
    }

}
