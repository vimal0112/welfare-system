package com.project.welfare.Entity; 

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "eligibility_history")
public class EligibilityHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int age;
    private String gender;
    private String category;
    private String state;
    private String occupation;
    private double annual_income;
    private String disability;
    private String is_minority;
    private double eligibility_score;
    private String eligibility_status;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "checked_at")
    private LocalDateTime checkedAt;

    public LocalDateTime getCheckedAt() {
        return checkedAt;
    }

    public void setCheckedAt(LocalDateTime checkedAt) {
        this.checkedAt = checkedAt;
    }

    
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
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
    public double getEligibility_score() {
        return eligibility_score;
    }
    public void setEligibility_score(double eligibility_score) {
        this.eligibility_score = eligibility_score;
    }
    public String getEligibility_status() {
        return eligibility_status;
    }
    public void setEligibility_status(String eligibility_status) {
        this.eligibility_status = eligibility_status;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    
}
