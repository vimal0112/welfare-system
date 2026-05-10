package com.project.welfare.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.welfare.Entity.Application;
import com.project.welfare.Entity.ApplicationStatus;
import com.project.welfare.Entity.User;
import com.project.welfare.dto.OfficerApplicationDetailDto;
import com.project.welfare.dto.OfficerApplicationSummaryDto;
import com.project.welfare.dto.OfficerDashboardDto;
import com.project.welfare.repository.ApplicationRepository;
import com.project.welfare.repository.SchemeRepository;
import com.project.welfare.repository.UserRepository;

@Service
public class OfficerApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final SchemeRepository schemeRepository;

    public OfficerApplicationService(
            ApplicationRepository applicationRepository,
            UserRepository userRepository,
            SchemeRepository schemeRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.schemeRepository = schemeRepository;
    }

    public OfficerDashboardDto getDashboard(Integer officerId) {
        long pendingAssigned = applicationRepository.countByStatusAndOfficerId(ApplicationStatus.PENDING, officerId);
        long pendingUnassigned = applicationRepository.countByStatusAndOfficerIdIsNull(ApplicationStatus.PENDING);
        long approved = applicationRepository.countByStatusAndOfficerId(ApplicationStatus.APPROVED, officerId);
        long rejected = applicationRepository.countByStatusAndOfficerId(ApplicationStatus.REJECTED, officerId);

        List<Application> recent = getVisibleApplications(ApplicationStatus.PENDING, officerId);
        List<OfficerApplicationSummaryDto> recentDtos = new ArrayList<>();
        for (Application app : recent.stream().limit(5).toList()) {
            recentDtos.add(toSummaryDto(app));
        }

        return new OfficerDashboardDto(pendingAssigned + pendingUnassigned, approved, rejected, recentDtos);
    }

    public List<OfficerApplicationSummaryDto> getApplications(ApplicationStatus status, Integer officerId) {
        List<Application> apps;
        if (status == null) {
            List<Application> assigned = applicationRepository.findByStatusAndOfficerIdOrderBySubmittedAtDesc(ApplicationStatus.PENDING, officerId);
            List<Application> unassigned = applicationRepository.findByStatusAndOfficerIdIsNullOrderBySubmittedAtDesc(ApplicationStatus.PENDING);
            apps = mergeApplications(assigned, unassigned);
        } else {
            apps = getVisibleApplications(status, officerId);
        }

        List<OfficerApplicationSummaryDto> result = new ArrayList<>();
        for (Application app : apps) {
            result.add(toSummaryDto(app));
        }
        return result;
    }

    public OfficerApplicationDetailDto getApplicationDetail(int id) {
        Optional<Application> appOpt = applicationRepository.findById(id);
        if (appOpt.isEmpty()) {
            return null;
        }

        Application app = appOpt.get();
        return toDetailDto(app);
    }

    public OfficerApplicationDetailDto updateStatus(
            int id,
            ApplicationStatus newStatus,
            Integer officerId,
            String remarks) {
        Optional<Application> appOpt = applicationRepository.findById(id);
        if (appOpt.isEmpty()) {
            return null;
        }

        Application app = appOpt.get();
        if (app.getOfficerId() != null && !app.getOfficerId().equals(officerId)) {
            return toDetailDto(app);
        }

        app.setStatus(newStatus);
        app.setOfficerId(officerId);
        app.setRemarks(remarks);
        app.setUpdatedAt(LocalDateTime.now());
        applicationRepository.save(app);

        return toDetailDto(app);
    }

    public boolean isVisibleToOfficer(Application app, Integer officerId) {
        return app.getOfficerId() == null || app.getOfficerId().equals(officerId);
    }

    private List<Application> getVisibleApplications(ApplicationStatus status, Integer officerId) {
        if (status == ApplicationStatus.PENDING) {
            List<Application> assigned = applicationRepository.findByStatusAndOfficerIdOrderBySubmittedAtDesc(status, officerId);
            List<Application> unassigned = applicationRepository.findByStatusAndOfficerIdIsNullOrderBySubmittedAtDesc(status);
            return mergeApplications(assigned, unassigned);
        }
        return applicationRepository.findByStatusAndOfficerIdOrderBySubmittedAtDesc(status, officerId);
    }

    private List<Application> mergeApplications(List<Application> a, List<Application> b) {
        List<Application> merged = new ArrayList<>();
        merged.addAll(a);
        merged.addAll(b);
        merged.sort((left, right) -> {
            LocalDateTime l = left.getSubmittedAt();
            LocalDateTime r = right.getSubmittedAt();
            if (l == null && r == null) return 0;
            if (l == null) return 1;
            if (r == null) return -1;
            return r.compareTo(l);
        });
        return merged;
    }

    private OfficerApplicationSummaryDto toSummaryDto(Application app) {
        String applicantName = "Unknown";
        Optional<User> userOpt = userRepository.findById(app.getUserId());
        if (userOpt.isPresent()) {
            applicantName = userOpt.get().getFullName();
        }

        String schemeName = schemeRepository.findSchemeNameById(app.getSchemeId()).orElse("Unknown");

        return new OfficerApplicationSummaryDto(
                app.getId(),
                applicantName,
                schemeName,
                app.getSubmittedAt(),
                app.getStatus());
    }

    private OfficerApplicationDetailDto toDetailDto(Application app) {
        OfficerApplicationDetailDto dto = new OfficerApplicationDetailDto();
        dto.setId(app.getId());
        dto.setStatus(app.getStatus());
        dto.setSubmittedAt(app.getSubmittedAt());
        dto.setUpdatedAt(app.getUpdatedAt());
        dto.setRemarks(app.getRemarks());
        dto.setOfficerId(app.getOfficerId());
        dto.setApplicationData(app.getApplicationData());

        Optional<User> userOpt = userRepository.findById(app.getUserId());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            OfficerApplicationDetailDto.CitizenDto citizen = new OfficerApplicationDetailDto.CitizenDto();
            citizen.setId(user.getId());
            citizen.setFullName(user.getFullName());
            citizen.setEmail(user.getEmail());
            citizen.setMobile(user.getMobile());
            dto.setCitizen(citizen);
        }

        OfficerApplicationDetailDto.SchemeDto schemeDto = new OfficerApplicationDetailDto.SchemeDto();
        schemeDto.setId(app.getSchemeId());
        schemeDto.setSchemeName(schemeRepository.findSchemeNameById(app.getSchemeId()).orElse("Unknown"));
        dto.setScheme(schemeDto);

        return dto;
    }
}
