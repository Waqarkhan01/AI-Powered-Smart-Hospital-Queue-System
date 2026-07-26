package com.hospital.controller;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String FLASK_BASE_URL = "http://127.0.0.1:5000";

    @PostMapping("/predict/priority")
    public ResponseEntity<?> predictPriority(@RequestBody Map<String, Object> vitals) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(vitals, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    FLASK_BASE_URL + "/predict/priority",
                    request,
                    Map.class
            );

            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(503).body(Map.of(
                    "error", "AI service unavailable",
                    "details", e.getMessage()
            ));
        }
    }
}