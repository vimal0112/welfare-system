package com.project.welfare.dto;

public class AdminSchemeRequestDto {

    private String schemeName;
    private String description;
    private String category;
    private Integer minAge;
    private Integer maxAge;
    private Double maxIncome;
    private String gender;
    private String location;
    private String occupation;
    private String disabilityRequired;
    private String minorityRequired;

    public String getSchemeName() {
        return schemeName;
    }

    public void setSchemeName(String schemeName) {
        this.schemeName = schemeName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getMinAge() {
        return minAge;
    }

    public void setMinAge(Integer minAge) {
        this.minAge = minAge;
    }

    public Integer getMaxAge() {
        return maxAge;
    }

    public void setMaxAge(Integer maxAge) {
        this.maxAge = maxAge;
    }

    public Double getMaxIncome() {
        return maxIncome;
    }

    public void setMaxIncome(Double maxIncome) {
        this.maxIncome = maxIncome;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public String getDisabilityRequired() {
        return disabilityRequired;
    }

    public void setDisabilityRequired(String disabilityRequired) {
        this.disabilityRequired = disabilityRequired;
    }

    public String getMinorityRequired() {
        return minorityRequired;
    }

    public void setMinorityRequired(String minorityRequired) {
        this.minorityRequired = minorityRequired;
    }
}
