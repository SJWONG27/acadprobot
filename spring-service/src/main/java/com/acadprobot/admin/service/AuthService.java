package com.acadprobot.admin.service;
import com.acadprobot.admin.model.User;
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
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // registration
    public User registerUser(String email, String password){

        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        String hashedPassword = passwordEncoder.encode(password);

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(hashedPassword);

        User savedUser = userRepository.save(newUser);
        System.out.println("User saved successfully: " + savedUser.getId());

        return savedUser;
    }


    public AuthResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(password, user.getPassword())){
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(Map.of(
                "sub", user.getId().toString(),
                "role", user.getRole().toString(),
                "email", email
        ));
        return new AuthResponse(token, "bearer", user.getRole().toString().toLowerCase() , email);
    }

    public User resetPassword(String email, String password){
        Optional<User> existingUser = userRepository.findByEmail(email);

        if(existingUser.isEmpty()){
            throw new RuntimeException("Email not exists");
        }

        User user = existingUser.get();
        String hashedPassword = passwordEncoder.encode(password);
        user.setPassword(hashedPassword);

        return userRepository.save(user);
    }

}
