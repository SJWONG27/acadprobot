package com.acadprobot.admin.repository;

import com.acadprobot.admin.model.AdminChatbotRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.*;

@Repository
public interface AdminChatbotRequestRepository extends JpaRepository<AdminChatbotRequest, UUID> {

    // JpaRepository interface already provides many built-in CRUD methods, like findbyid/findall
    //SELECT acr FROM AdminChatbotRequest acr WHERE acr.status = :status
    List<AdminChatbotRequest> findByStatus(String status);

}
