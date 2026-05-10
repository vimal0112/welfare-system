package com.project.welfare.dto;

public class SchemeRecommendationDto {

    private int scheme_id;  
    private String scheme_name;
    public int getScheme_id() {
        return scheme_id;
    }

    public void setScheme_id(int scheme_id) {
        this.scheme_id = scheme_id;
    }

    private String reason;

    public SchemeRecommendationDto(int scheme_id, String scheme_name, String reason) {
        this.scheme_id = scheme_id;
        this.scheme_name = scheme_name;
        this.reason = reason;
    }

    public String getScheme_name() {
        return scheme_name;
    }

    public void setScheme_name(String scheme_name) {
        this.scheme_name = scheme_name;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
