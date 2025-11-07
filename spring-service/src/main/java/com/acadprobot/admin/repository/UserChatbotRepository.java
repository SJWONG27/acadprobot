package com.acadprobot.admin.repository;

import com.acadprobot.admin.model.Chatbots;
import com.acadprobot.admin.model.User;
import com.acadprobot.admin.model.UserChatbots;
import com.acadprobot.admin.model.UserChatbotID;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

@Repository
public interface UserChatbotRepository extends JpaRepository<UserChatbots, UserChatbotID> {
    @Query("SELECT uc.chatbot FROM UserChatbots uc WHERE uc.id.userId = :userId")
    List<Chatbots> findChatbotsByUserId(@Param("userId") UUID userId);

    @Query("SELECT uc.user FROM UserChatbots uc WHERE uc.id.chatbotId = :chatbotId")
    List<User> findUsersByChatbotId(@Param("chatbotId") UUID chatbotId);
}
