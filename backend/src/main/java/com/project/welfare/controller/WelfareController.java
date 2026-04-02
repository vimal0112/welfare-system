package com.project.welfare.controller;

import java.util.List;
import org.springframework.data.domain.PageRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import com.project.welfare.Entity.EligibilityHistory;
import java.time.LocalDateTime;
import com.project.welfare.dto.SchemeListDto;
import com.project.welfare.dto.SchemeRecommendationDto;
import com.project.welfare.dto.WelfareRequestDto;
import com.project.welfare.dto.WelfareResponseDto;
import com.project.welfare.repository.EligibilityHistoryRepository;
import com.project.welfare.service.MlService;
import com.project.welfare.service.SchemeRecommendationService;
import com.project.welfare.repository.SchemeRepository;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/welfare")
public class WelfareController {

    @Autowired
    private MlService mlService;

    @Autowired
    private SchemeRepository schemeRepository;

    @Autowired
    private EligibilityHistoryRepository eligibilityHistoryRepository;

    @Autowired
    private SchemeRecommendationService schemeRecommendationService;

    @PostMapping("/check-eligibility")
    public ResponseEntity<WelfareResponseDto> checkEligibility(
            @RequestBody WelfareRequestDto request) {

        // 1. Call ML service
        double score = mlService.getEligibilityScore(request);

        // 2. Decide eligibility status
        String status;
        if (score >= 0.60) {
            status = "ELIGIBLE";
        } else if (score >= 0.50) {
            status = "PARTIALLY_ELIGIBLE";
        } else {
            status = "NOT_ELIGIBLE";
        }

        // 3. Get scheme recommendations
        List<SchemeRecommendationDto> recommendedSchemes =
                schemeRecommendationService.recommendSchemesWithReasons(request, status);

        // 4. Save to DB
        EligibilityHistory history = new EligibilityHistory();
        history.setAge(request.getAge());
        history.setGender(request.getGender());
        history.setCategory(request.getCategory());
        history.setState(request.getState());
        history.setOccupation(request.getOccupation());
        history.setAnnual_income(request.getAnnual_income());
        history.setDisability(request.getDisability());
        history.setIs_minority(request.getIs_minority());
        history.setEligibility_score(score);
        history.setEligibility_status(status);
        history.setUserId(request.getUserId());
        history.setCheckedAt(LocalDateTime.now());

        eligibilityHistoryRepository.save(history);

        // 5. Return final response
        WelfareResponseDto response =
                new WelfareResponseDto(score, status, recommendedSchemes);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/recent")
    public List<SchemeListDto> getRecentSchemes() {
        return schemeRepository.findRecentForList(PageRequest.of(0, 2));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getEligibilityHistory(@RequestParam(required = false) Integer userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().body("userId is required");
        }

        return ResponseEntity.ok(
            eligibilityHistoryRepository.findAllByUserIdOrderByCheckedAtDesc(userId)
        );
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<?> getEligibilityHistoryUser(@PathVariable Integer userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().body("userId is required");
        }
        
        return ResponseEntity.ok(
            eligibilityHistoryRepository.findAllByUserIdOrderByCheckedAtDesc(userId)
        );
    }

}
