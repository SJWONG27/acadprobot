package com.acadprobot.admin.controller;

import com.acadprobot.admin.model.AdminChatbotRequest;
import com.acadprobot.admin.model.Chatbots;
import com.acadprobot.admin.service.SuperAdminService;
import com.acadprobot.admin.service.UnrelatedQueriesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/superadmin")
public class SuperAdminController {
    @Autowired
    private SuperAdminService superAdminService;

    @Autowired
    private UnrelatedQueriesService unrelatedQueriesService;

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

    @PostMapping("/approverequest")
    public ResponseEntity<?> approveRequest(@RequestParam("request_id")  UUID request_id){
        return ResponseEntity.ok(superAdminService.approveRequest(request_id));
    }

    @PostMapping("/rejectrequest")
    public ResponseEntity<?> rejectRequest(@RequestParam("request_id")  UUID request_id){
        return ResponseEntity.ok(superAdminService.rejectRequest(request_id));
    }

    @GetMapping("/downloadreport")
    public ResponseEntity<InputStreamResource> downloadExcel() throws IOException {
        ByteArrayInputStream excelFile = unrelatedQueriesService.exportToExcel();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=unrelated_queries.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(excelFile));
    }
}
