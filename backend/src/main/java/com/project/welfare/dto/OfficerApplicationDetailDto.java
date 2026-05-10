package com.project.welfare.dto;

import java.time.LocalDateTime;

import com.project.welfare.Entity.ApplicationStatus;

public class OfficerApplicationDetailDto {

    private int id;
    private ApplicationStatus status;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
    private String remarks;
    private Integer officerId;
    private String applicationData;
    private CitizenDto citizen;
    private SchemeDto scheme;

    public static class CitizenDto {
        private int id;
        private String fullName;
        private String email;
        private String mobile;

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getMobile() {
            return mobile;
        }

        public void setMobile(String mobile) {
            this.mobile = mobile;
        }
    }

    public static class SchemeDto {
        private int id;
        private String schemeName;

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getSchemeName() {
            return schemeName;
        }

        public void setSchemeName(String schemeName) {
            this.schemeName = schemeName;
        }
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public String getApplicationData() {
        return applicationData;
    }

    public void setApplicationData(String applicationData) {
        this.applicationData = applicationData;
    }

    public CitizenDto getCitizen() {
        return citizen;
    }

    public void setCitizen(CitizenDto citizen) {
        this.citizen = citizen;
    }

    public SchemeDto getScheme() {
        return scheme;
    }

    public void setScheme(SchemeDto scheme) {
        this.scheme = scheme;
    }
}
