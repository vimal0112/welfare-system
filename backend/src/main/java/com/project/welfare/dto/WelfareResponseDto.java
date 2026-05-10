package com.project.welfare.dto;

import java.util.List;

public class WelfareResponseDto {

    private double eligibility_score;
    private String eligibility_status;
    private List<SchemeRecommendationDto> recommended_schemes;

    public WelfareResponseDto(double eligibility_score,
                              String eligibility_status,
                              List<SchemeRecommendationDto> recommended_schemes) {
        this.eligibility_score = eligibility_score;
        this.eligibility_status = eligibility_status;
        this.recommended_schemes = recommended_schemes;
    }

    public double getEligibility_score() {
        return eligibility_score;
    }

    public String getEligibility_status() {
        return eligibility_status;
    }

    public List<SchemeRecommendationDto> getRecommended_schemes() {
        return recommended_schemes;
    }
}
