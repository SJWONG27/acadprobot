package com.acadprobot.admin.service;

import com.acadprobot.admin.dto.UserDTO;
import com.acadprobot.admin.model.User;
import com.acadprobot.admin.repository.AdminRepository;
import com.acadprobot.admin.repository.UserChatbotRepository;
import com.acadprobot.admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import com.acadprobot.admin.model.UserChatbotID;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserChatbotRepository userChatbotRepository;


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
