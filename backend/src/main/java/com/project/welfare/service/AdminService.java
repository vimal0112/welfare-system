package com.project.welfare.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

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
import com.project.welfare.repository.ApplicationRepository;
import com.project.welfare.repository.SchemeDetailsRepository;
import com.project.welfare.repository.SchemeRepository;
import com.project.welfare.repository.UserRepository;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final SchemeRepository schemeRepository;
    private final ApplicationRepository applicationRepository;
    private final SchemeDetailsRepository schemeDetailsRepository;

    public AdminService(
            UserRepository userRepository,
            SchemeRepository schemeRepository,
            ApplicationRepository applicationRepository,
            SchemeDetailsRepository schemeDetailsRepository) {
        this.userRepository = userRepository;
        this.schemeRepository = schemeRepository;
        this.applicationRepository = applicationRepository;
        this.schemeDetailsRepository = schemeDetailsRepository;
    }

    public AdminDashboardDto getDashboard() {
        long totalUsers = userRepository.count();
        long totalSchemes = schemeRepository.count();
        long totalApplications = applicationRepository.count();
        long totalOfficers = userRepository.countByRole("OFFICER");
        return new AdminDashboardDto(totalUsers, totalSchemes, totalApplications, totalOfficers);
    }

    public List<Scheme> getSchemes() {
        return schemeRepository.findAllWithDetails();
    }

    public Scheme createScheme(AdminSchemeRequestDto request) {
        Scheme scheme = new Scheme();
        applySchemeFields(scheme, request);
        return schemeRepository.save(scheme);
    }

    public Scheme updateScheme(int id, AdminSchemeRequestDto request) {
        Optional<Scheme> schemeOpt = schemeRepository.findById(id);
        if (schemeOpt.isEmpty()) {
            return null;
        }
        Scheme scheme = schemeOpt.get();
        applySchemeFields(scheme, request);
        return schemeRepository.save(scheme);
    }

    public boolean deleteScheme(int id) {
        if (!schemeRepository.existsById(id)) {
            return false;
        }
        schemeRepository.deleteById(id);
        return true;
    }

    public SchemeDetails updateSchemeDetails(int schemeId, AdminSchemeDetailsRequestDto request) {
        Scheme scheme = schemeRepository.findById(schemeId).orElse(null);
        if (scheme == null) {
            return null;
        }

        SchemeDetails details = schemeDetailsRepository.findBySchemeId(schemeId);
        if (details == null) {
            details = new SchemeDetails();
            details.setScheme(scheme);
        }

        if (request.getEligibility() != null) details.setEligibility(request.getEligibility());
        if (request.getBenefits() != null) details.setBenefits(request.getBenefits());
        if (request.getDocumentsRequired() != null) details.setDocumentsRequired(request.getDocumentsRequired());
        if (request.getApplicationProcess() != null) details.setApplicationProcess(request.getApplicationProcess());
        if (request.getOfficialWebsite() != null) details.setOfficialWebsite(request.getOfficialWebsite());
        if (request.getHelplineNumber() != null) details.setHelplineNumber(request.getHelplineNumber());

        return schemeDetailsRepository.save(details);
    }

    public List<User> getUsers(String role) {
        if (role == null || role.isBlank()) {
            return userRepository.findAll();
        }
        return userRepository.findAll()
                .stream()
                .filter(user -> role.equalsIgnoreCase(user.getRole()))
                .collect(java.util.stream.Collectors.toList());
    }

    public User createOfficer(AdminOfficerCreateDto request) {
        User officer = new User();
        officer.setFullName(request.getFullName());
        officer.setEmail(request.getEmail());
        officer.setMobile(request.getMobile());
        officer.setPassword(request.getPassword());
        officer.setRole("OFFICER");
        officer.setActive(true);
        return userRepository.save(officer);
    }

    public User updateUserRole(int id, String role) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return null;
        }
        User user = userOpt.get();
        user.setRole(role.toUpperCase());
        return userRepository.save(user);
    }

    public User updateUserStatus(int id, boolean active) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return null;
        }
        User user = userOpt.get();
        user.setActive(active);
        return userRepository.save(user);
    }

    public Application assignOfficer(int applicationId, AdminAssignOfficerDto request) {
        Optional<Application> appOpt = applicationRepository.findById(applicationId);
        if (appOpt.isEmpty()) {
            return null;
        }
        Application app = appOpt.get();
        app.setOfficerId(request.getOfficerId());
        return applicationRepository.save(app);
    }

    public List<AdminApplicationSummaryDto> getApplications() {
        List<Application> apps = applicationRepository.findAllByOrderBySubmittedAtDesc();
        return apps.stream()
                .map(app -> {
                    String applicantName = userRepository.findById(app.getUserId())
                            .map(User::getFullName)
                            .orElse("Unknown");
                    String schemeName = schemeRepository.findSchemeNameById(app.getSchemeId())
                            .orElse("Unknown");
                    return new AdminApplicationSummaryDto(
                            app.getId(),
                            applicantName,
                            schemeName,
                            app.getStatus(),
                            app.getSubmittedAt(),
                            app.getOfficerId());
                })
                .collect(java.util.stream.Collectors.toList());
    }

    private void applySchemeFields(Scheme scheme, AdminSchemeRequestDto request) {
        if (request.getSchemeName() != null) scheme.setSchemeName(request.getSchemeName());
        if (request.getDescription() != null) scheme.setDescription(request.getDescription());
        if (request.getCategory() != null) scheme.setCategory(request.getCategory());
        if (request.getMinAge() != null) scheme.setMinAge(request.getMinAge());
        if (request.getMaxAge() != null) scheme.setMaxAge(request.getMaxAge());
        if (request.getMaxIncome() != null) scheme.setMaxIncome(request.getMaxIncome());
        if (request.getGender() != null) scheme.setGender(request.getGender());
        if (request.getLocation() != null) scheme.setLocation(request.getLocation());
        if (request.getOccupation() != null) scheme.setOccupation(request.getOccupation());
        if (request.getDisabilityRequired() != null) scheme.setDisabilityRequired(request.getDisabilityRequired());
        if (request.getMinorityRequired() != null) scheme.setMinorityRequired(request.getMinorityRequired());
    }
}
