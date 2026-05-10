package com.project.welfare.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.welfare.Entity.Application;
import com.project.welfare.Entity.Scheme;
import com.project.welfare.Entity.SchemeDetails;
import com.project.welfare.Entity.User;
import com.project.welfare.dto.AdminApplicationSummaryDto;
import com.project.welfare.dto.AdminAssignOfficerDto;
import com.project.welfare.dto.AdminDashboardDto;
import com.project.welfare.dto.AdminOfficerCreateDto;
import com.project.welfare.dto.AdminSchemeDetailsRequestDto;
import com.project.welfare.dto.AdminSchemeRequestDto;
import com.project.welfare.dto.AdminUserRoleUpdateDto;
import com.project.welfare.dto.AdminUserStatusUpdateDto;
import com.project.welfare.service.AdminService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public AdminDashboardDto getDashboard() {
        return adminService.getDashboard();
    }

    @GetMapping("/schemes")
    public List<Scheme> getSchemes() {
        return adminService.getSchemes();
    }

    @PostMapping("/schemes")
    public ResponseEntity<?> createScheme(@RequestBody AdminSchemeRequestDto request) {
        if (request == null || request.getSchemeName() == null || request.getSchemeName().isBlank()) {
            return ResponseEntity.badRequest().body("Scheme name is required");
        }
        Scheme scheme = adminService.createScheme(request);
        return ResponseEntity.ok(scheme);
    }

    @PutMapping("/schemes/{id}")
    public ResponseEntity<?> updateScheme(
            @PathVariable int id,
            @RequestBody AdminSchemeRequestDto request) {
        Scheme scheme = adminService.updateScheme(id, request);
        if (scheme == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Scheme not found");
        }
        return ResponseEntity.ok(scheme);
    }

    @PutMapping("/schemes/{id}/details")
    public ResponseEntity<?> updateSchemeDetails(
            @PathVariable int id,
            @RequestBody AdminSchemeDetailsRequestDto request) {
        SchemeDetails details = adminService.updateSchemeDetails(id, request);
        if (details == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Scheme not found");
        }
        return ResponseEntity.ok(details);
    }

    @DeleteMapping("/schemes/{id}")
    public ResponseEntity<?> deleteScheme(@PathVariable int id) {
        boolean deleted = adminService.deleteScheme(id);
        if (!deleted) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Scheme not found");
        }
        return ResponseEntity.ok("Scheme deleted");
    }

    @GetMapping("/users")
    public List<User> getUsers(@RequestParam(required = false) String role) {
        return adminService.getUsers(role);
    }

    @GetMapping("/applications")
    public List<AdminApplicationSummaryDto> getApplications() {
        return adminService.getApplications();
    }

    @PostMapping("/officer")
    public ResponseEntity<?> createOfficer(@RequestBody AdminOfficerCreateDto request) {
        if (request == null || request.getFullName() == null || request.getMobile() == null) {
            return ResponseEntity.badRequest().body("fullName and mobile are required");
        }
        User officer = adminService.createOfficer(request);
        return ResponseEntity.ok(officer);
    }

    @PutMapping("/user/{id}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable int id,
            @RequestBody AdminUserRoleUpdateDto request) {
        if (request == null || request.getRole() == null || request.getRole().isBlank()) {
            return ResponseEntity.badRequest().body("role is required");
        }
        User user = adminService.updateUserRole(id, request.getRole());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("/user/{id}/status")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable int id,
            @RequestBody AdminUserStatusUpdateDto request) {
        if (request == null || request.getActive() == null) {
            return ResponseEntity.badRequest().body("active is required");
        }
        User user = adminService.updateUserStatus(id, request.getActive());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("/application/{id}/assign")
    public ResponseEntity<?> assignOfficer(
            @PathVariable int id,
            @RequestBody AdminAssignOfficerDto request) {
        if (request == null || request.getOfficerId() == null) {
            return ResponseEntity.badRequest().body("officerId is required");
        }
        Application app = adminService.assignOfficer(id, request);
        if (app == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Application not found");
        }
        return ResponseEntity.ok(app);
    }
}
