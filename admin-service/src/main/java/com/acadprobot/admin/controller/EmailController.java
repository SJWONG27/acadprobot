package com.acadprobot.admin.controller;

import com.acadprobot.admin.service.EmailService;
import com.acadprobot.admin.service.ExcelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/emailservice")
public class EmailController {

    @Autowired
    private  EmailService emailService;

    @Autowired
    private ExcelService excelService;

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
                .append("We have completed the review of your chatbot request for ")
                .append(chatbotName).append(".\n\n");

        if (status.equalsIgnoreCase("approved")) {
            emailBody.append("Good news! Your chatbot request has been <b>approved</b>. ")
                    .append("You can now access and manage your chatbot in your AcadProBot dashboard.\n\n");
        } else if (status.equalsIgnoreCase("rejected")) {
            emailBody.append("Unfortunately, your chatbot request has been rejected. ")
                    .append("Please review the feedback below and make any necessary changes before resubmitting.\n\n");
        }

        if (!remarks.isEmpty()) {
            emailBody.append("Remarks: ").append(remarks).append("\n\n");
        }

        emailBody.append("Thank you for using AcadProBot!\n\n\n")
                .append("Best regards,\n")
                .append("AcadProBot Admin Team");

        emailService.sendEmail(recipientEmail, subject, emailBody.toString());
        return "Chatbot approval result email sent.";
    }


    @PostMapping("/sendchatbotinvitation")
    public String sendChatbotInvitationsFromExcel(
            @RequestParam("file") MultipartFile file,
            @RequestParam("refercode") String refercode,
            @RequestParam("chatbot_name") String chatbotName,
            @RequestParam("sender_email") String senderEmail ) {

        if (file.isEmpty()) return "Uploaded file is empty.";

        try {
            List<String> emailList = excelService.extractEmailsFromExcel(file);

            for (String recipientEmail : emailList) {
                String subject = "AcadProBot - Invitation to " + chatbotName;

                String body = String.format(
                        "Hi,\n\nHere is the joining refercode for %s.\n\n%s\n\n" +
                                "If you encounter any problem joining the chatbot, kindly reach out to the chatbot admin at %s.\n\n" +
                                "Thank you for using AcadProBot!\n\nBest regards,\nAcadProBot Admin Team",
                        chatbotName, refercode, senderEmail
                );

                emailService.sendEmail(recipientEmail, subject, body);
            }

            return "Invitations sent successfully to " + emailList.size() + " recipients.";

        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to process Excel file: " + e.getMessage();
        }
    }


}
