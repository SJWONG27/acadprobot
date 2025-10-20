package com.acadprobot.admin.controller;

import com.acadprobot.admin.model.Admin;
import com.acadprobot.admin.model.User;
import com.acadprobot.admin.repository.AdminRepository;
import com.acadprobot.admin.dto.UserDTO;
import com.acadprobot.admin.service.AdminService;
import com.acadprobot.admin.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AdminService adminService;

}
