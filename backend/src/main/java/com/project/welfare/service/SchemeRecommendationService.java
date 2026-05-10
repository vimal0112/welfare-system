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
                    scheme.getLocation().equalsIgnoreCase("All") ||
                    scheme.getLocation().equalsIgnoreCase("Rural") ||
                    scheme.getLocation().equalsIgnoreCase("Urban") ||
                    isIndiaWide(scheme.getLocation());

            boolean occupationMatch = matchesField(scheme.getOccupation(), user.getOccupation());
            boolean disabilityMatch = matchesField(scheme.getDisabilityRequired(), user.getDisability());
            boolean minorityMatch = matchesField(scheme.getMinorityRequired(), user.getIs_minority());

            // ✅ MATCH SCORE LOGIC
            int matchScore = 0;

            if (ageMatch) matchScore++;
            if (incomeMatch) matchScore++;
            if (categoryMatch) matchScore++;
            if (genderMatch) matchScore++;
            if (locationMatch) matchScore++;
            if (occupationMatch) matchScore++;
            if (disabilityMatch) matchScore++;
            if (minorityMatch) matchScore++;

            // ✅ Allow partial match (>= 5 conditions satisfied)
            if (matchScore >= 5) {

                StringBuilder reason = new StringBuilder();

                if (ageMatch) {
                    reason.append("Age criteria matched. ");
                }

                if (incomeMatch) {
                    reason.append("Income within limit. ");
                }

                if (categoryMatch) {
                    reason.append("Category matched. ");
                }

                if (genderMatch) {
                    reason.append("Gender eligible. ");
                }

                if (occupationMatch) {
                    reason.append("Occupation matched. ");
                }

                if ("Yes".equalsIgnoreCase(scheme.getDisabilityRequired())
                        && "Yes".equalsIgnoreCase(user.getDisability())) {
                    reason.append("Disability criteria matched. ");
                }

                if ("Yes".equalsIgnoreCase(scheme.getMinorityRequired())
                        && "Yes".equalsIgnoreCase(user.getIs_minority())) {
                    reason.append("Minority criteria matched. ");
                }

                result.add(
                        new SchemeRecommendationDto(
                                scheme.getId(),
                                scheme.getSchemeName(),
                                reason.toString().trim()
                        )
                );
            }
        }

        return result;
    }

    // ✅ FLEXIBLE MATCH FUNCTION
    private boolean matchesField(String schemeValue, String userValue) {

        if (schemeValue == null || schemeValue.isBlank()) return true;

        if (schemeValue.equalsIgnoreCase("ANY") ||
            schemeValue.equalsIgnoreCase("ALL") ||
            schemeValue.equalsIgnoreCase("GENERAL")) {
            return true;
        }

        if (userValue == null || userValue.isBlank()) return false;

        return schemeValue.equalsIgnoreCase(userValue);
    }

    private boolean isIndiaWide(String location) {
        return location != null && location.trim().equalsIgnoreCase("India");
    }
}