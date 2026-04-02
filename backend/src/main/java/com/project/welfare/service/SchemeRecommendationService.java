package com.project.welfare.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.welfare.dto.SchemeListDto;
import com.project.welfare.dto.SchemeRecommendationDto;
import com.project.welfare.dto.WelfareRequestDto;
import com.project.welfare.repository.SchemeRepository;

@Service
public class SchemeRecommendationService {

    @Autowired
    private SchemeRepository schemeRepository;

    public List<SchemeRecommendationDto> recommendSchemesWithReasons(
            WelfareRequestDto user,
            String eligibilityStatus) {

        if (eligibilityStatus.equals("NOT_ELIGIBLE")) {
            return List.of();
        }

        List<SchemeListDto> allSchemes = schemeRepository.findAllForList();
        List<SchemeRecommendationDto> result = new ArrayList<>();

        for (SchemeListDto scheme : allSchemes) {
            Integer minAge = scheme.getMinAge();
            Integer maxAge = scheme.getMaxAge();
            Double maxIncome = scheme.getMaxIncome();

            boolean ageMatch = (minAge == null || minAge <= 0 || user.getAge() >= minAge);
            if (maxAge != null && maxAge > 0) {
                ageMatch = ageMatch && user.getAge() <= maxAge;
            }

            boolean incomeMatch = (maxIncome == null || maxIncome <= 0 || user.getAnnual_income() <= maxIncome);

            boolean categoryMatch = matchesField(scheme.getCategory(), user.getCategory());

            boolean genderMatch = matchesField(scheme.getGender(), user.getGender());

            boolean locationMatch =
                    matchesField(scheme.getLocation(), user.getState()) ||
                    isIndiaWide(scheme.getLocation());

            boolean occupationMatch = matchesField(scheme.getOccupation(), user.getOccupation());

            boolean disabilityMatch = matchesField(scheme.getDisabilityRequired(), user.getDisability());

            boolean minorityMatch = matchesField(scheme.getMinorityRequired(), user.getIs_minority());

            if (ageMatch && incomeMatch && categoryMatch && genderMatch && locationMatch
                    && occupationMatch && disabilityMatch && minorityMatch) {

                StringBuilder reason = new StringBuilder();

                if (minAge != null && minAge >= 60) {
                    reason.append("Applicant age is above ").append(minAge).append(". ");
                }

                if ("Farmer".equalsIgnoreCase(scheme.getOccupation())) {
                    reason.append("Applicant is a farmer. ");
                }

                if (maxIncome != null && maxIncome > 0) {
                    reason.append("Annual income is below ")
                            .append(maxIncome.intValue())
                            .append(". ");
                }

                if ("Yes".equalsIgnoreCase(scheme.getDisabilityRequired())) {
                    reason.append("Applicant has a disability. ");
                }

                if ("Yes".equalsIgnoreCase(scheme.getMinorityRequired())) {
                    reason.append("Applicant belongs to a minority group. ");
                }

                result.add(
                        new SchemeRecommendationDto(
                                scheme.getId(),
                                scheme.getSchemeName(),
                                reason.toString().trim()));
            }
        }

        return result;
    }

    private boolean matchesField(String schemeValue, String userValue) {
        if (schemeValue == null || schemeValue.isBlank()) {
            return true;
        }
        if (userValue == null || userValue.isBlank()) {
            return false;
        }

        String normalizedSchemeValue = schemeValue.trim();
        String normalizedUserValue = userValue.trim();

        return normalizedSchemeValue.equalsIgnoreCase("ANY")
                || normalizedSchemeValue.equalsIgnoreCase("ALL")
                || normalizedSchemeValue.equalsIgnoreCase("GENERAL")
                || normalizedSchemeValue.equalsIgnoreCase(normalizedUserValue);
    }

    private boolean isIndiaWide(String location) {
        return location != null && location.trim().equalsIgnoreCase("India");
    }
}
