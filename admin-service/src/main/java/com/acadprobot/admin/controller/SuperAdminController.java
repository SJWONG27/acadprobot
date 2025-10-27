package com.acadprobot.admin.controller;

import com.acadprobot.admin.model.AdminChatbotRequest;
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

    @PostMapping("/requestadmin")
    public ResponseEntity<?> createAdminChatbotRequest(@RequestBody Map<String, String> body){
        String email = body.get("email");
        String fullname = body.get("fullname");
        String title = body.get("title");
        String chatbot_name = body.get("chatbot_name");
        String departmentProgram = body.get("department_program");
        String purpose = body.get("purpose");

        AdminChatbotRequest adminChatbotRequest = superAdminService.createAdminChatbotRequest(
                email,
                fullname,
                title,
                chatbot_name,
                departmentProgram,
                purpose
        );

        return ResponseEntity.ok(adminChatbotRequest);
    }

    @GetMapping("/requestadmin")
    public ResponseEntity<List<AdminChatbotRequest>> getAllRequestByStatus(@RequestParam("status") String status){
        return ResponseEntity.ok(superAdminService.getAllRequestByStatus(status));
    }
}
