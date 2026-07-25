package com.hospital.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AIService {

    private final RestTemplate restTemplate;
    private static final String AI_BASE_URL = "http://localhost:5000";

    public Map<String, Object> predictPriority(Map<String, Object> patientData) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(patientData, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                AI_BASE_URL + "/predict/priority", request, Map.class);
            return response.getBody();
        } catch (Exception e) {
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("priority", "MEDIUM");
            fallback.put("priorityCode", 1);
            fallback.put("confidence", 0.0);
            return fallback;
        }
    }

    public Map<String, Object> predictWaitTime(int queueCount, int priorityCode) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            Map<String, Object> body = new HashMap<>();
            body.put("queueCount", queueCount);
            body.put("priorityCode", priorityCode);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                AI_BASE_URL + "/predict/waittime", request, Map.class);
            return response.getBody();
        } catch (Exception e) {
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("estimatedWaitTime", queueCount * 15);
            fallback.put("unit", "minutes");
            return fallback;
        }
    }
}
