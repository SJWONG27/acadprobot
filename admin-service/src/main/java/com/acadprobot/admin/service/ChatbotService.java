package com.acadprobot.admin.service;

import com.acadprobot.admin.model.Chatbots;
import com.acadprobot.admin.model.User;
import com.acadprobot.admin.model.UserChatbotID;
import com.acadprobot.admin.model.UserChatbots;
import com.acadprobot.admin.repository.ChatbotRepository;
import com.acadprobot.admin.repository.UserChatbotRepository;
import com.acadprobot.admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class ChatbotService {

    @Autowired
    private ChatbotRepository chatbotRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserChatbotRepository userChatbotRepository;

//    public UserChatbots joinChatbot(UUID user_id, String refercode){
//        Chatbots chatbot = chatbotRepository.findByRefercode(refercode)
//                .orElseThrow(() -> new RuntimeException("chatbot not found"));
//
//        UUID chatbot_id = chatbot.getId();
//
//        UserChatbotID id = new UserChatbotID(user_id, chatbot_id);
//
//        if (userChatbotRepository.existsById(id)) {
//            throw new RuntimeException("User already joined this chatbot");
//        }
//
//        UserChatbots newJoin = new UserChatbots(id);
//
//        return userChatbotRepository.save(newJoin);
//    }

    public UserChatbots joinChatbot(UUID user_id, String refercode) {
        // 1️⃣ Find the chatbot
        Chatbots chatbot = chatbotRepository.findByRefercode(refercode)
                .orElseThrow(() -> new RuntimeException("Chatbot not found"));

        // 2️⃣ Find the user
        User user = userRepository.findById(user_id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3️⃣ Create composite ID
        UserChatbotID id = new UserChatbotID(user_id, chatbot.getId());

        // 4️⃣ Prevent duplicate join
        if (userChatbotRepository.existsById(id)) {
            throw new RuntimeException("User already joined this chatbot");
        }

        // 5️⃣ Create and link entities properly
        UserChatbots newJoin = new UserChatbots();
        newJoin.setId(id);
        newJoin.setUser(user);
        newJoin.setChatbot(chatbot);

        // 6️⃣ Save
        return userChatbotRepository.save(newJoin);
    }


    public List<Chatbots> getChatbotsByUser(UUID userId) {
        return userChatbotRepository.findChatbotsByUserId(userId);
    }

}
