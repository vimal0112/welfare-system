package com.project.welfare.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.project.welfare.Entity.Application;
import com.project.welfare.Entity.ApplicationStatus;
import com.project.welfare.dto.ApplicationCreateRequestDto;
import com.project.welfare.dto.UserApplicationSummaryDto;
import com.project.welfare.repository.ApplicationRepository;
import com.project.welfare.repository.SchemeRepository;
import com.project.welfare.repository.UserRepository;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final SchemeRepository schemeRepository;
    private final UserRepository userRepository;

    public ApplicationController(
            ApplicationRepository applicationRepository,
            SchemeRepository schemeRepository,
            UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.schemeRepository = schemeRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> submitApplication(
            @RequestHeader("X-User-Id") Integer userId,
            @RequestBody ApplicationCreateRequestDto request) {

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User ID is required");
        }

        if (request == null || request.getSchemeId() <= 0) {
            return ResponseEntity.badRequest().body("schemeId is required");
        }

        if (!schemeRepository.existsById(request.getSchemeId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Scheme not found");
        }

        Application app = new Application();
        app.setUserId(userId);
        app.setSchemeId(request.getSchemeId());
        app.setStatus(ApplicationStatus.PENDING);
        app.setApplicationData(request.getApplicationData());

        Application saved = applicationRepository.save(app);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserApplications(
            @PathVariable int userId,
            @RequestHeader("X-User-Id") Integer headerUserId) {
        if (headerUserId == null || headerUserId != userId) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(
                applicationRepository.findByUserIdOrderBySubmittedAtDesc(userId)
                        .stream()
                        .map(app -> {
                            String schemeName = schemeRepository.findSchemeNameById(app.getSchemeId())
                                    .orElse("Unknown");
                            String officerName = null;
                            if (app.getOfficerId() != null) {
                                officerName = userRepository.findById(app.getOfficerId())
                                        .map(user -> user.getFullName())
                                        .orElse(null);
                            }
                            return new UserApplicationSummaryDto(
                                    app.getId(),
                                    app.getSchemeId(),
                                    schemeName,
                                    app.getStatus(),
                                    app.getSubmittedAt(),
                                    app.getUpdatedAt(),
                                    app.getRemarks(),
                                    app.getOfficerId(),
                                    officerName);
                        })
                        .collect(java.util.stream.Collectors.toList())
        );
    }
}
