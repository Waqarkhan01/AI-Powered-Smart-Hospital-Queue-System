package com.hospital.controller;

import com.hospital.entity.Admission;
import com.hospital.entity.Bed;
import com.hospital.entity.Bed.BedStatus;
import com.hospital.entity.Hospital;
import com.hospital.entity.Notification;
import com.hospital.entity.Patient;
import com.hospital.repository.AdmissionRepository;
import com.hospital.repository.BedRepository;
import com.hospital.repository.HospitalRepository;
import com.hospital.repository.NotificationRepository;
import com.hospital.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admissions")
public class AdmissionController {

    @Autowired
    private AdmissionRepository admissionRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private BedRepository bedRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @PostMapping
    public ResponseEntity<?> admitPatient(@RequestParam Long patientId,
                                           @RequestParam Long hospitalId,
                                           @RequestParam(required = false) Long bedId,
                                           @RequestParam(required = false) String diagnosis) {
        Patient patient = patientRepository.findById(patientId).orElse(null);
        Hospital hospital = hospitalRepository.findById(hospitalId).orElse(null);

        if (patient == null || hospital == null) {
            return ResponseEntity.badRequest().body("Invalid patient or hospital");
        }

        Admission admission = new Admission();
        admission.setPatient(patient);
        admission.setHospital(hospital);
        admission.setDiagnosis(diagnosis);
        admission.setStatus("ADMITTED");
        admission.setAdmittedOn(LocalDateTime.now());

        if (bedId != null) {
            Bed bed = bedRepository.findById(bedId).orElse(null);
            if (bed != null) {
                bed.setStatus(BedStatus.OCCUPIED);
                bedRepository.save(bed);
                admission.setBed(bed);
            }
        }

        return ResponseEntity.ok(admissionRepository.save(admission));
    }

    @GetMapping("/patient/{patientId}")
    public List<Admission> getPatientAdmissions(@PathVariable Long patientId) {
        return admissionRepository.findByPatientId(patientId);
    }

    @GetMapping("/hospital/{hospitalId}")
    public List<Admission> getHospitalAdmissions(@PathVariable Long hospitalId) {
        return admissionRepository.findByHospitalId(hospitalId);
    }

    @PutMapping("/{id}/release")
    public ResponseEntity<?> releasePatient(@PathVariable Long id) {
        Admission admission = admissionRepository.findById(id).orElse(null);
        if (admission == null) {
            return ResponseEntity.notFound().build();
        }

        admission.setStatus("RELEASED");
        admission.setReleasedOn(LocalDateTime.now());

        if (admission.getBed() != null) {
            Bed bed = admission.getBed();
            bed.setStatus(BedStatus.AVAILABLE);
            bedRepository.save(bed);
        }

        Admission saved = admissionRepository.save(admission);

        createNotification(admission.getPatient(), "You have been released from " + admission.getHospital().getName() + ". We wish you good health!");

        return ResponseEntity.ok(saved);
    }

    private void createNotification(Patient patient, String message) {
        Notification notification = new Notification();
        notification.setPatient(patient);
        notification.setMessage(message);
        notification.setType("APP");
        notification.setSent(true);
        notificationRepository.save(notification);
    }
}