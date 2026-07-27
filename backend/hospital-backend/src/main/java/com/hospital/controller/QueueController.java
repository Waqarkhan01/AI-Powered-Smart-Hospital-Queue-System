package com.hospital.controller;

import com.hospital.entity.*;
import com.hospital.entity.Queue.BedType;
import com.hospital.entity.Queue.Priority;
import com.hospital.entity.Queue.QueueStatus;
import com.hospital.entity.Bed.BedStatus;
import com.hospital.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
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

    @Autowired
    private BedRepository bedRepository;

    @Autowired
    private AdmissionRepository admissionRepository;

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
    public ResponseEntity<?> admitPatient(@PathVariable Long queueId) {
        Queue entry = queueRepository.findById(queueId).orElse(null);
        if (entry == null) {
            return ResponseEntity.notFound().build();
        }

        List<Bed> beds = bedRepository.findAll();
        Bed availableBed = beds.stream()
                .filter(b -> b.getHospital().getId().equals(entry.getHospital().getId()))
                .filter(b -> b.getBedType().name().equals(entry.getBedType().name()))
                .filter(b -> b.getStatus() == BedStatus.AVAILABLE)
                .findFirst()
                .orElse(null);

        if (availableBed == null) {
            return ResponseEntity.badRequest().body("No available bed of type " + entry.getBedType() + " at this hospital");
        }

        availableBed.setStatus(BedStatus.OCCUPIED);
        bedRepository.save(availableBed);

        Admission admission = new Admission();
        admission.setPatient(entry.getPatient());
        admission.setHospital(entry.getHospital());
        admission.setBed(availableBed);
        admission.setStatus("ADMITTED");
        admission.setAdmittedOn(LocalDateTime.now());
        admissionRepository.save(admission);

        entry.setStatus(QueueStatus.ADMITTED);
        entry.setAdmittedAt(LocalDateTime.now());
        queueRepository.save(entry);

        return ResponseEntity.ok(admission);
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