package com.acadprobot.admin.service;

import com.acadprobot.admin.model.AdminChatbotRequest;
import com.acadprobot.admin.repository.AdminChatbotRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AdminRequestService {

    @Autowired
    private AdminChatbotRequestRepository adminChatbotRequestRepository;

//    create
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

//    read
    public List<AdminChatbotRequest> getAllRequestByStatus(String status){
        return adminChatbotRequestRepository.findByStatus(status);
    }

//    update
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
