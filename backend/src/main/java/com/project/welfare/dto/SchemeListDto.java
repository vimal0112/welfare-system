package com.project.welfare.dto;

public class SchemeListDto {
    private int id;
    private String schemeName;
    private Integer minAge;
    private Integer maxAge;
    private Double maxIncome;
    private String category;
    private String gender;
    private String location;
    private String occupation;
    private String description;
    private String disabilityRequired;
    private String minorityRequired;

    public SchemeListDto() {
    }

    public SchemeListDto(
            int id,
            String schemeName,
            Integer minAge,
            Integer maxAge,
            Double maxIncome,
            String category,
            String gender,
            String location,
            String occupation,
            String description,
            String disabilityRequired,
            String minorityRequired) {
        this.id = id;
        this.schemeName = schemeName;
        this.minAge = minAge;
        this.maxAge = maxAge;
        this.maxIncome = maxIncome;
        this.category = category;
        this.gender = gender;
        this.location = location;
        this.occupation = occupation;
        this.description = description;
        this.disabilityRequired = disabilityRequired;
        this.minorityRequired = minorityRequired;
    }

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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
