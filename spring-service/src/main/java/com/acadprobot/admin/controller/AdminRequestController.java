package com.acadprobot.admin.controller;

import com.acadprobot.admin.model.AdminChatbotRequest;
import com.acadprobot.admin.service.AdminRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/adminrequest")
public class AdminRequestController {
    @Autowired
    private AdminRequestService adminRequestService;

    @PostMapping
    public ResponseEntity<?> createAdminChatbotRequest(@RequestBody Map<String, String> body){
        String email = body.get("email");
        String fullname = body.get("fullname");
        String title = body.get("title");
        String chatbot_name = body.get("chatbot_name");
        String departmentProgram = body.get("department_program");
        String purpose = body.get("purpose");

        AdminChatbotRequest adminChatbotRequest = adminRequestService.createAdminChatbotRequest(
                email,
                fullname,
                title,
                chatbot_name,
                departmentProgram,
                purpose
        );

        return ResponseEntity.ok(adminChatbotRequest);
    }

    @GetMapping
    public ResponseEntity<List<AdminChatbotRequest>> getAllRequestByStatus(@RequestParam("status") String status){
        return ResponseEntity.ok(adminRequestService.getAllRequestByStatus(status));
    }

//    operation update
    @PostMapping("/approverequest")
    public ResponseEntity<?> approveRequest(@RequestParam("request_id") UUID request_id){
        return ResponseEntity.ok(adminRequestService.approveRequest(request_id));
    }

    @PostMapping("/rejectrequest")
    public ResponseEntity<?> rejectRequest(@RequestParam("request_id")  UUID request_id){
        return ResponseEntity.ok(adminRequestService.rejectRequest(request_id));
    }

}
