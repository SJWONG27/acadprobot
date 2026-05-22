package com.acadprobot.admin.controller;

import com.acadprobot.admin.service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/chatbot/user")
public class ChatbotUserController {
    @Autowired
    private ChatbotService chatbotService;

    @PostMapping("/")
    public ResponseEntity<?> joinChatbot(@RequestBody Map<String, String> body){
        String userIdStr = body.get("user_id");
        String refercode = body.get("refercode");

        UUID userId = UUID.fromString(userIdStr);

        return ResponseEntity.ok(chatbotService.joinChatbot(userId, refercode));
    }

    @GetMapping("/")
    public ResponseEntity<?> getChatbotUnderUser(@RequestParam("user_id") String userIdStr) {
        UUID userId = UUID.fromString(userIdStr);
        return ResponseEntity.ok(chatbotService.getChatbotsByUser(userId));
    }

    @DeleteMapping("/")
    public ResponseEntity<?> leaveChatbot(@RequestBody Map<String, String> body){
        String userIdStr = body.get("user_id");
        String chatbotIdStr = body.get("chatbot_id");

        UUID userId = UUID.fromString(userIdStr);
        UUID chatbotId = UUID.fromString(chatbotIdStr);

        return ResponseEntity.ok(chatbotService.leaveChatbot(userId, chatbotId));
    }


}
