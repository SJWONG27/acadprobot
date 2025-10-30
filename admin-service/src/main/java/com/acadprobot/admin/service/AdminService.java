package com.acadprobot.admin.service;

import com.acadprobot.admin.model.Chatbots;
import com.acadprobot.admin.model.User;
import com.acadprobot.admin.repository.ChatbotRepository;
import com.acadprobot.admin.repository.UserChatbotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import com.acadprobot.admin.model.UserChatbotID;

@Service
public class AdminService {

    @Autowired
    private UserChatbotRepository userChatbotRepository;

    @Autowired
    private ChatbotRepository chatbotRepository;

    public List<Chatbots> getChatbotsByAdmin(UUID userId){
        return chatbotRepository.findByUser_Id(userId);
    }

    public List<User> getUsersByChatbot(UUID chatbotId){
        return userChatbotRepository.findUsersByChatbotId(chatbotId);
    }

    public void removeUserFromChatbot(UUID userId, UUID chatbotId) {
        UserChatbotID id = new UserChatbotID(userId, chatbotId);
        if (userChatbotRepository.existsById(id)) {
            userChatbotRepository.deleteById(id);
            System.out.println("User " + userId + " removed from chatbot " + chatbotId);
        } else {
            System.out.println("Mapping not found for user " + userId + " and chatbot " + chatbotId);
        }
    }

}
