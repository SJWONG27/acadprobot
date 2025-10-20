package com.acadprobot.admin.controller;

import com.acadprobot.admin.model.Chatbots;
import com.acadprobot.admin.service.SuperAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/superadmin")
public class SuperAdminController {
    @Autowired
    private SuperAdminService superAdminService;

    @PostMapping("/createchatbot")
    public ResponseEntity<?> createChatbot(@RequestBody Map<String, String> body) {
        String chatbotName = body.get("chatbotName");
        String adminEmail = body.get("adminEmail");

        Chatbots chatbot = superAdminService.createChatbot(chatbotName, adminEmail);
        return ResponseEntity.ok(chatbot);
    }

    @GetMapping("/chatbots")
    public ResponseEntity<List<Chatbots>> getAllChatbots(){
        return ResponseEntity.ok(superAdminService.getAllChatbots());
    }

    @DeleteMapping("/chatbots/{id}")
    public ResponseEntity<?> deleteChatbot(@PathVariable UUID id){
        return ResponseEntity.ok(superAdminService.deleteChatbot(id));
    }
}
