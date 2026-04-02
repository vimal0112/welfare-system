package com.project.welfare.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.welfare.Entity.Application;
import com.project.welfare.Entity.ApplicationStatus;

public interface ApplicationRepository extends JpaRepository<Application, Integer> {
    List<Application> findByStatusOrderBySubmittedAtDesc(ApplicationStatus status);
    List<Application> findByStatusAndOfficerIdOrderBySubmittedAtDesc(ApplicationStatus status, Integer officerId);
    List<Application> findByStatusAndOfficerIdIsNullOrderBySubmittedAtDesc(ApplicationStatus status);
    List<Application> findAllByOrderBySubmittedAtDesc();
    List<Application> findTop5ByOrderBySubmittedAtDesc();
    long countByStatus(ApplicationStatus status);
    long countByStatusAndOfficerId(ApplicationStatus status, Integer officerId);
    long countByStatusAndOfficerIdIsNull(ApplicationStatus status);
    List<Application> findByUserIdOrderBySubmittedAtDesc(int userId);
}
