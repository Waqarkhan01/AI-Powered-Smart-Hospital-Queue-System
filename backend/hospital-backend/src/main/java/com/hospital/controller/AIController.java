package com.hospital.controller;

import com.hospital.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AIController {

    private final AIService aiService;

    @PostMapping("/predict/priority")
    public ResponseEntity<Map<String, Object>> predictPriority(@RequestBody Map<String, Object> patientData) {
        return ResponseEntity.ok(aiService.predictPriority(patientData));
    }

    @PostMapping("/predict/waittime")
    public ResponseEntity<Map<String, Object>> predictWaitTime(@RequestBody Map<String, Object> data) {
        int queueCount = (int) data.getOrDefault("queueCount", 0);
        int priorityCode = (int) data.getOrDefault("priorityCode", 1);
        return ResponseEntity.ok(aiService.predictWaitTime(queueCount, priorityCode));
    }
}
