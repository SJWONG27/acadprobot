package com.acadprobot.admin.service;

import com.acadprobot.admin.model.Admin;
import com.acadprobot.admin.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.acadprobot.admin.repository.ChatbotRepository;
import com.acadprobot.admin.model.Chatbots;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.*;

@Service
public class SuperAdminService {
    @Autowired
    private ChatbotRepository chatbotRepository;

    @Autowired
    private AdminRepository adminRepository;

    public Chatbots createChatbot(String chatbotName, String adminEmail){
        Admin admin = adminRepository.findByEmail(adminEmail)
                .orElseThrow(()->new RuntimeException("Admin not found: " + adminEmail));

        Chatbots newChatbot = new Chatbots();
        newChatbot.setAdmin(admin);
        newChatbot.setName(chatbotName);

        return chatbotRepository.save(newChatbot);
    }

    public List<Chatbots> getAllChatbots(){
        return chatbotRepository.findAll();
    }

    public ResponseEntity<?> deleteChatbot(@PathVariable UUID id){
        chatbotRepository.deleteById(id);
        return ResponseEntity.ok("Chatbot deleted successfully");
    }

}
