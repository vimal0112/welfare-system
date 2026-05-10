package com.project.welfare.dto;

public class AdminSchemeDetailsRequestDto {

    private String eligibility;
    private String benefits;
    private String documentsRequired;
    private String applicationProcess;
    private String officialWebsite;
    private String helplineNumber;

    public String getEligibility() {
        return eligibility;
    }

    public void setEligibility(String eligibility) {
        this.eligibility = eligibility;
    }

    public String getBenefits() {
        return benefits;
    }

    public void setBenefits(String benefits) {
        this.benefits = benefits;
    }

    public String getDocumentsRequired() {
        return documentsRequired;
    }

    public void setDocumentsRequired(String documentsRequired) {
        this.documentsRequired = documentsRequired;
    }

    public String getApplicationProcess() {
        return applicationProcess;
    }

    public void setApplicationProcess(String applicationProcess) {
        this.applicationProcess = applicationProcess;
    }

    public String getOfficialWebsite() {
        return officialWebsite;
    }

    public void setOfficialWebsite(String officialWebsite) {
        this.officialWebsite = officialWebsite;
    }

    public String getHelplineNumber() {
        return helplineNumber;
    }

    public void setHelplineNumber(String helplineNumber) {
        this.helplineNumber = helplineNumber;
    }
}
