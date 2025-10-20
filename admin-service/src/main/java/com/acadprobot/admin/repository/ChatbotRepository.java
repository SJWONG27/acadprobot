package com.acadprobot.admin.repository;

import com.acadprobot.admin.model.Chatbots;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatbotRepository extends JpaRepository<Chatbots, UUID> {
    Optional<Chatbots> findByRefercode(String refercode);

}
