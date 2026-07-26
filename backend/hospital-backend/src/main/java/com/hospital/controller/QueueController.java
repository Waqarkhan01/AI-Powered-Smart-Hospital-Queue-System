package com.hospital.controller;

import com.hospital.entity.Doctor;
import com.hospital.entity.Hospital;
import com.hospital.entity.Patient;
import com.hospital.entity.Queue;
import com.hospital.entity.Queue.BedType;
import com.hospital.entity.Queue.Priority;
import com.hospital.entity.Queue.QueueStatus;
import com.hospital.repository.HospitalRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.repository.QueueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/queue")
public class QueueController {

    @Autowired
    private QueueRepository queueRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @PostMapping("/join")
    public ResponseEntity<?> joinQueue(@RequestParam Long patientId,
                                        @RequestParam Long hospitalId,
                                        @RequestParam BedType bedType,
                                        @RequestParam Priority priority) {
        Patient patient = patientRepository.findById(patientId).orElse(null);
        Hospital hospital = hospitalRepository.findById(hospitalId).orElse(null);

        if (patient == null || hospital == null) {
            return ResponseEntity.badRequest().body("Invalid patient or hospital");
        }

        Queue queue = new Queue();
        queue.setPatient(patient);
        queue.setHospital(hospital);
        queue.setBedType(bedType);
        queue.setPriority(priority);
        queue.setStatus(QueueStatus.WAITING);

        long position = queueRepository.countByHospitalIdAndStatus(hospitalId, QueueStatus.WAITING) + 1;
        queue.setQueuePosition((int) position);
        queue.setEstimatedWaitTime((int) position * 15);

        return ResponseEntity.ok(queueRepository.save(queue));
    }

    @GetMapping("/patient/{patientId}")
    public List<Queue> getPatientQueue(@PathVariable Long patientId) {
        return queueRepository.findByPatientIdAndStatus(patientId, QueueStatus.WAITING);
    }

    @GetMapping("/hospital/{hospitalId}")
    public List<Queue> getHospitalQueue(@PathVariable Long hospitalId) {
        return queueRepository.findByHospitalIdAndStatus(hospitalId, QueueStatus.WAITING);
    }

    @PutMapping("/{queueId}/admit")
    public ResponseEntity<Queue> admitPatient(@PathVariable Long queueId) {
        return queueRepository.findById(queueId)
                .map(entry -> {
                    entry.setStatus(QueueStatus.ADMITTED);
                    entry.setAdmittedAt(java.time.LocalDateTime.now());
                    return ResponseEntity.ok(queueRepository.save(entry));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelQueueEntry(@PathVariable Long id) {
        if (!queueRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        queueRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}