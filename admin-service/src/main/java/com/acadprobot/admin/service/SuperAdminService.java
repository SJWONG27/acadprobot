package com.acadprobot.admin.service;

import com.acadprobot.admin.model.Admin;
import com.acadprobot.admin.model.AdminChatbotRequest;
import com.acadprobot.admin.repository.AdminChatbotRequestRepository;
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

    @Autowired
    private AdminChatbotRequestRepository adminChatbotRequestRepository;

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

    // admin chatbot request handling
    public AdminChatbotRequest createAdminChatbotRequest(
            String email,
            String fullname,
            String title,
            String chatbot_name,
            String departmentProgram,
            String purpose
    ){
        AdminChatbotRequest adminChatbotRequest = new AdminChatbotRequest();
        adminChatbotRequest.setEmail(email);
        adminChatbotRequest.setFullname(fullname);
        adminChatbotRequest.setTitle(title);
        adminChatbotRequest.setChatbot_name(chatbot_name);
        adminChatbotRequest.setDepartment_program(departmentProgram);
        adminChatbotRequest.setPurpose(purpose);

        return adminChatbotRequestRepository.save(adminChatbotRequest);
    }

    public List<AdminChatbotRequest> getAllRequestByStatus(String status){
        return adminChatbotRequestRepository.findByStatus(status);
    }

    public String approveRequest(UUID id){
        Optional<AdminChatbotRequest> requestOpt = adminChatbotRequestRepository.findById(id);
        if(requestOpt.isEmpty()){
            return "Request not found" + id;
        }
        AdminChatbotRequest adminChatbotRequest = requestOpt.get();
        adminChatbotRequest.setStatus("approved");

        adminChatbotRequestRepository.save(adminChatbotRequest);

        return "Request approved for " + adminChatbotRequest.getEmail();
    }

    public String rejectRequest(UUID id){
        Optional<AdminChatbotRequest> requestOpt = adminChatbotRequestRepository.findById(id);
        if(requestOpt.isEmpty()){
            return "Request not found" + id;
        }
        AdminChatbotRequest adminChatbotRequest = requestOpt.get();
        adminChatbotRequest.setStatus("rejected");

        adminChatbotRequestRepository.save(adminChatbotRequest);

        return "Request rejected for " + adminChatbotRequest.getEmail();
    }

}
