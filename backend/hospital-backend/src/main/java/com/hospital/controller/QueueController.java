package com.hospital.controller;

import com.hospital.entity.Queue;
import com.hospital.entity.Queue.BedType;
import com.hospital.entity.Queue.Priority;
import com.hospital.service.QueueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/queue")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QueueController {

    private final QueueService queueService;

    @PostMapping("/join")
    public ResponseEntity<Queue> joinQueue(
            @RequestParam Long patientId,
            @RequestParam Long hospitalId,
            @RequestParam BedType bedType,
            @RequestParam Priority priority) {
        return ResponseEntity.ok(queueService.joinQueue(patientId, hospitalId, bedType, priority));
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<Queue>> getHospitalQueue(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(queueService.getHospitalQueue(hospitalId));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Queue>> getPatientQueue(@PathVariable Long patientId) {
        return ResponseEntity.ok(queueService.getPatientQueue(patientId));
    }

    @PutMapping("/{queueId}/admit")
    public ResponseEntity<Queue> admitPatient(@PathVariable Long queueId) {
        return ResponseEntity.ok(queueService.admitPatient(queueId));
    }

    @PutMapping("/{queueId}/cancel")
    public ResponseEntity<Queue> cancelQueue(@PathVariable Long queueId) {
        return ResponseEntity.ok(queueService.cancelQueue(queueId));
    }
}
