package com.project.welfare.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.project.welfare.dto.WelfareRequestDto;

@Service
public class MlService {

    @Value("${ml.api.url}")
    private String ML_API_URL;


    public double getEligibilityScore(WelfareRequestDto dto) {

        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> requestMap = new HashMap<>();
        requestMap.put("age", dto.getAge());
        requestMap.put("gender", dto.getGender());
        requestMap.put("category", dto.getCategory());
        requestMap.put("state", dto.getState());
        requestMap.put("occupation", dto.getOccupation());
        requestMap.put("annual_income", dto.getAnnual_income());
        requestMap.put("disability", dto.getDisability());
        requestMap.put("is_minority", dto.getIs_minority());

        try {
    Map<?, ?> response = restTemplate.postForObject(
        ML_API_URL,
        requestMap,
        Map.class
    );

    if (response != null && response.get("eligibility_score") != null) {
        return ((Number) response.get("eligibility_score")).doubleValue();
    }

} catch (Exception e) {
    System.out.println("ML API failed: " + e.getMessage());
}

// 🔥 fallback score
return 0.7;
    }
}
