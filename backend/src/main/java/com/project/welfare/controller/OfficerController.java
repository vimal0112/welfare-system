package com.project.welfare.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.welfare.Entity.ApplicationStatus;
import com.project.welfare.dto.OfficerActionRequestDto;
import com.project.welfare.dto.OfficerApplicationDetailDto;
import com.project.welfare.service.OfficerApplicationService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/officer")
public class OfficerController {

    private final OfficerApplicationService officerApplicationService;

    public OfficerController(OfficerApplicationService officerApplicationService) {
        this.officerApplicationService = officerApplicationService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(
            @RequestHeader("X-User-Id") Integer officerId) {
        if (officerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Officer ID is required");
        }
        return ResponseEntity.ok(officerApplicationService.getDashboard(officerId));
    }

    @GetMapping("/applications/pending")
    public ResponseEntity<?> getPendingApplications(
            @RequestHeader("X-User-Id") Integer officerId) {
        if (officerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Officer ID is required");
        }
        return ResponseEntity.ok(officerApplicationService.getApplications(ApplicationStatus.PENDING, officerId));
    }

    @GetMapping("/applications")
    public ResponseEntity<?> getApplications(
            @RequestParam(required = false) String status,
            @RequestHeader("X-User-Id") Integer officerId) {
        if (officerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Officer ID is required");
        }
        ApplicationStatus parsedStatus = null;
        if (status != null && !status.isBlank()) {
            try {
                parsedStatus = ApplicationStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                return ResponseEntity.badRequest().body("Invalid status");
            }
        }

        return ResponseEntity.ok(officerApplicationService.getApplications(parsedStatus, officerId));
    }

    @GetMapping("/application/{id}")
    public ResponseEntity<?> getApplicationDetail(
            @PathVariable int id,
            @RequestHeader("X-User-Id") Integer officerId) {
        if (officerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Officer ID is required");
        }
        OfficerApplicationDetailDto dto = officerApplicationService.getApplicationDetail(id);
        if (dto == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Application not found");
        }
        if (dto.getOfficerId() != null && !dto.getOfficerId().equals(officerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not assigned to this officer");
        }
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/application/{id}/approve")
    public ResponseEntity<?> approveApplication(
            @PathVariable int id,
            @RequestHeader("X-User-Id") Integer officerId,
            @RequestBody OfficerActionRequestDto request) {
        if (officerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Officer ID is required");
        }
        if (request == null || request.getRemarks() == null || request.getRemarks().isBlank()) {
            return ResponseEntity.badRequest().body("Remarks are required");
        }

        OfficerApplicationDetailDto current = officerApplicationService.getApplicationDetail(id);
        if (current == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Application not found");
        }
        if (current.getOfficerId() != null && !current.getOfficerId().equals(officerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not assigned to this officer");
        }
        if (current.getStatus() != ApplicationStatus.PENDING) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Application is not in PENDING state");
        }

        OfficerApplicationDetailDto dto =
                officerApplicationService.updateStatus(id, ApplicationStatus.APPROVED, officerId, request.getRemarks());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/application/{id}/reject")
    public ResponseEntity<?> rejectApplication(
            @PathVariable int id,
            @RequestHeader("X-User-Id") Integer officerId,
            @RequestBody OfficerActionRequestDto request) {
        if (officerId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Officer ID is required");
        }
        if (request == null || request.getRemarks() == null || request.getRemarks().isBlank()) {
            return ResponseEntity.badRequest().body("Remarks are required");
        }

        OfficerApplicationDetailDto current = officerApplicationService.getApplicationDetail(id);
        if (current == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Application not found");
        }
        if (current.getOfficerId() != null && !current.getOfficerId().equals(officerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not assigned to this officer");
        }
        if (current.getStatus() != ApplicationStatus.PENDING) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Application is not in PENDING state");
        }

        OfficerApplicationDetailDto dto =
                officerApplicationService.updateStatus(id, ApplicationStatus.REJECTED, officerId, request.getRemarks());
        return ResponseEntity.ok(dto);
    }
}
