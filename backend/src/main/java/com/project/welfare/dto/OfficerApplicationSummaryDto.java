package com.project.welfare.dto;

import java.time.LocalDateTime;

import com.project.welfare.Entity.ApplicationStatus;

public class OfficerApplicationSummaryDto {

    private int id;
    private String applicantName;
    private String schemeName;
    private LocalDateTime submittedAt;
    private ApplicationStatus status;

    public OfficerApplicationSummaryDto() {
    }

    public OfficerApplicationSummaryDto(
            int id,
            String applicantName,
            String schemeName,
            LocalDateTime submittedAt,
            ApplicationStatus status) {
        this.id = id;
        this.applicantName = applicantName;
        this.schemeName = schemeName;
        this.submittedAt = submittedAt;
        this.status = status;
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

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
}
