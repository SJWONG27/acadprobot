package com.acadprobot.admin.controller;

import com.acadprobot.admin.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/superadmin")
public class EmailController {

    @Autowired
    private  EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/sendresetemail")
    public String sendResetEmail(@RequestParam("recipient_email") String recipientEmail){
        String subject = "AcadProBot Password Reset Request";

        String body = "Hi there,\n\n"
                + "We received a request to reset your AcadProBot account password. "
                + "If you made this request, please click the link below to reset your password:\n\n"
                + "https://acadprobot.com/reset-password?email=" + recipientEmail + "\n\n"
                + "If you did not request a password reset, please ignore this email.\n\n"
                + "Best regards,\n"
                + "The AcadProBot Team";

        emailService.sendEmail(recipientEmail, subject, body);
        return "Reset Email Sent";
    }

    @PostMapping("/sendAdminChatbotResultEmail")
    public String sendAdminChatbotResultEmail(@RequestBody Map<String, String> body) {
        String title = body.get("title");
        String fullname = body.get("fullname");
        String chatbotName = body.get("chatbot_name");
        String recipientEmail = body.get("recipient_email");
        String status = body.get("status"); // e.g. "approved" or "rejected"
        String remarks = body.getOrDefault("remarks", ""); // optional custom message

        String subject = "AcadProBot – Chatbot Request "
                + (status.equalsIgnoreCase("approved") ? "Approved" : "Rejected");

        StringBuilder emailBody = new StringBuilder();
        emailBody.append("Hi ").append(title).append(" ").append(fullname).append(",\n\n")
                .append("We have completed the review of your chatbot request for **")
                .append(chatbotName).append("**.\n\n");

        if (status.equalsIgnoreCase("approved")) {
            emailBody.append("🎉 Good news! Your chatbot request has been **approved**. ")
                    .append("You can now access and manage your chatbot in your AcadProBot dashboard.\n\n");
        } else if (status.equalsIgnoreCase("rejected")) {
            emailBody.append("Unfortunately, your chatbot request has been **rejected**. ")
                    .append("Please review the feedback below and make any necessary changes before resubmitting.\n\n");
        }

        if (!remarks.isEmpty()) {
            emailBody.append("Remarks: ").append(remarks).append("\n\n");
        }

        emailBody.append("Thank you for using AcadProBot!\n")
                .append("Best regards,\n")
                .append("The AcadProBot Admin Team");

        emailService.sendEmail(recipientEmail, subject, emailBody.toString());
        return "Chatbot approval result email sent.";
    }

}
