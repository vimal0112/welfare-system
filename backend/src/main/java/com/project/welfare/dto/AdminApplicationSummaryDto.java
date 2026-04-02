package com.project.welfare.dto;

import java.time.LocalDateTime;

import com.project.welfare.Entity.ApplicationStatus;

public class AdminApplicationSummaryDto {

    private int id;
    private String applicantName;
    private String schemeName;
    private ApplicationStatus status;
    private LocalDateTime submittedAt;
    private Integer officerId;

    public AdminApplicationSummaryDto() {
    }

    public AdminApplicationSummaryDto(
            int id,
            String applicantName,
            String schemeName,
            ApplicationStatus status,
            LocalDateTime submittedAt,
            Integer officerId) {
        this.id = id;
        this.applicantName = applicantName;
        this.schemeName = schemeName;
        this.status = status;
        this.submittedAt = submittedAt;
        this.officerId = officerId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public String getSchemeName() {
        return schemeName;
    }

    public void setSchemeName(String schemeName) {
        this.schemeName = schemeName;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public Integer getOfficerId() {
        return officerId;
    }

    public void setOfficerId(Integer officerId) {
        this.officerId = officerId;
    }
}
