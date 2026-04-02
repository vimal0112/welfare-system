package com.project.welfare.dto;

import java.util.List;

public class OfficerDashboardDto {

    private long pendingCount;
    private long approvedCount;
    private long rejectedCount;
    private List<OfficerApplicationSummaryDto> recentApplications;

    public OfficerDashboardDto() {
    }

    public OfficerDashboardDto(
            long pendingCount,
            long approvedCount,
            long rejectedCount,
            List<OfficerApplicationSummaryDto> recentApplications) {
        this.pendingCount = pendingCount;
        this.approvedCount = approvedCount;
        this.rejectedCount = rejectedCount;
        this.recentApplications = recentApplications;
    }

    public long getPendingCount() {
        return pendingCount;
    }

    public void setPendingCount(long pendingCount) {
        this.pendingCount = pendingCount;
    }

    public long getApprovedCount() {
        return approvedCount;
    }

    public void setApprovedCount(long approvedCount) {
        this.approvedCount = approvedCount;
    }

    public long getRejectedCount() {
        return rejectedCount;
    }

    public void setRejectedCount(long rejectedCount) {
        this.rejectedCount = rejectedCount;
    }

    public List<OfficerApplicationSummaryDto> getRecentApplications() {
        return recentApplications;
    }

    public void setRecentApplications(List<OfficerApplicationSummaryDto> recentApplications) {
        this.recentApplications = recentApplications;
    }
}
