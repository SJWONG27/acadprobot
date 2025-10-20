package com.acadprobot.admin.service;

import com.acadprobot.admin.dto.UserDTO;
import com.acadprobot.admin.model.User;
import com.acadprobot.admin.repository.AdminRepository;
import com.acadprobot.admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;


//    public List<UserDTO> getUsersByAdmin(UUID adminId) {
//        List<User> users = userRepository.findByAdminId(adminId);
//
//        return users.stream()
//                .map(user -> new UserDTO(
//                        user.getId(),
//                        user.getEmail(),
//                        user.getCreated_at()
//                ))
//                .collect(Collectors.toList());
//    }

}
