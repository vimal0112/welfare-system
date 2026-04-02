package com.project.welfare.dto;

public class WelfareRequestDto {

    private int age;
    private String gender;
    private String category;
    private String state;
    private String occupation;
    private double annual_income;
    private String disability;     
    private String is_minority;    
    private Integer userId;

    public int getAge() {
        return age;
    }
    public void setAge(int age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }

    public String getState() {
        return state;
    }
    public void setState(String state) {
        this.state = state;
    }

    public String getOccupation() {
        return occupation;
    }
    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public double getAnnual_income() {
        return annual_income;
    }
    public void setAnnual_income(double annual_income) {
        this.annual_income = annual_income;
    }

    public String getDisability() {
        return disability;
    }
    public void setDisability(String disability) {
        this.disability = disability;
    }

    public String getIs_minority() {
        return is_minority;
    }
    public void setIs_minority(String is_minority) {
        this.is_minority = is_minority;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
