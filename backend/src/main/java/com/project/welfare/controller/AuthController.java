package com.project.welfare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.welfare.Entity.User;
import com.project.welfare.repository.UserRepository;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/signup")
    public String signup(@RequestBody User user) {

        if (userRepository.findByMobile(user.getMobile()) != null) {
            return "Mobile number already registered";
        }

        if (user.getEmail() != null && 
            userRepository.findByEmail(user.getEmail()) != null) {
            return "Email already registered";
        }

        if (user.getRole() == null) {
            user.setRole("USER");
        }

        userRepository.save(user);
        return "Signup successful";
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User request) {

        User user = null;

        if (request.getMobile() != null && !request.getMobile().isEmpty()) {
            user = userRepository.findByMobile(request.getMobile());
        } 
        else if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            user = userRepository.findByEmail(request.getEmail());
        }

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User not found");
        }

        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid password");
        }

        if (!user.isActive()) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("Account disabled");
        }

        return ResponseEntity.ok(user);
    }

    @GetMapping("/admin/schemes")
    public String adminOnly(@RequestParam String role) {
        if (!role.equals("ADMIN")) {
            return "Access Denied";
        }
        return "Admin Scheme Management";
    }

    @GetMapping("/officer/verify")
    public String officerOnly(@RequestParam String role) {
        if (!role.equals("OFFICER")) {
            return "Access Denied";
        }
        return "Officer Verification Panel";
    }

}
