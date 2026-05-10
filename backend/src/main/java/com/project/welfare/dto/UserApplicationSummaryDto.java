package com.project.welfare.dto;

import java.time.LocalDateTime;

import com.project.welfare.Entity.ApplicationStatus;

public class UserApplicationSummaryDto {

    private int id;
    private int schemeId;
    private String schemeName;
    private ApplicationStatus status;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
    private String remarks;
    private Integer officerId;
    private String officerName;

    public UserApplicationSummaryDto() {
    }

    public UserApplicationSummaryDto(
            int id,
            int schemeId,
            String schemeName,
            ApplicationStatus status,
            LocalDateTime submittedAt,
            LocalDateTime updatedAt,
            String remarks,
            Integer officerId,
            String officerName) {
        this.id = id;
        this.schemeId = schemeId;
        this.schemeName = schemeName;
        this.status = status;
        this.submittedAt = submittedAt;
        this.updatedAt = updatedAt;
        this.remarks = remarks;
        this.officerId = officerId;
        this.officerName = officerName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getSchemeId() {
        return schemeId;
    }

    public void setSchemeId(int schemeId) {
        this.schemeId = schemeId;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public Integer getOfficerId() {
        return officerId;
    }

    public void setOfficerId(Integer officerId) {
        this.officerId = officerId;
    }

    public String getOfficerName() {
        return officerName;
    }

    public void setOfficerName(String officerName) {
        this.officerName = officerName;
    }
}
