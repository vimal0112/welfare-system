package com.project.welfare.dto;

public class AdminDashboardDto {

    private long totalUsers;
    private long totalSchemes;
    private long totalApplications;
    private long totalOfficers;

    public AdminDashboardDto() {
    }

    public AdminDashboardDto(
            long totalUsers,
            long totalSchemes,
            long totalApplications,
            long totalOfficers) {
        this.totalUsers = totalUsers;
        this.totalSchemes = totalSchemes;
        this.totalApplications = totalApplications;
        this.totalOfficers = totalOfficers;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalSchemes() {
        return totalSchemes;
    }

    public void setTotalSchemes(long totalSchemes) {
        this.totalSchemes = totalSchemes;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public void setTotalApplications(long totalApplications) {
        this.totalApplications = totalApplications;
    }

    public long getTotalOfficers() {
        return totalOfficers;
    }

    public void setTotalOfficers(long totalOfficers) {
        this.totalOfficers = totalOfficers;
    }
}
