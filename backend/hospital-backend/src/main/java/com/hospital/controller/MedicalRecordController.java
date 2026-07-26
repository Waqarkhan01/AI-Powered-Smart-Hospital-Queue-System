package com.hospital.controller;

import com.hospital.entity.Doctor;
import com.hospital.entity.MedicalRecord;
import com.hospital.entity.Patient;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.MedicalRecordRepository;
import com.hospital.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @PostMapping
    public ResponseEntity<?> createRecord(@RequestParam Long patientId,
                                           @RequestParam(required = false) Long doctorId,
                                           @RequestBody MedicalRecord recordDetails) {
        Patient patient = patientRepository.findById(patientId).orElse(null);
        if (patient == null) {
            return ResponseEntity.badRequest().body("Invalid patient");
        }

        recordDetails.setPatient(patient);

        if (doctorId != null) {
            Doctor doctor = doctorRepository.findById(doctorId).orElse(null);
            recordDetails.setDoctor(doctor);
        }

        return ResponseEntity.ok(medicalRecordRepository.save(recordDetails));
    }

    @GetMapping("/patient/{patientId}")
    public List<MedicalRecord> getPatientRecords(@PathVariable Long patientId) {
        return medicalRecordRepository.findByPatientId(patientId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        if (!medicalRecordRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        medicalRecordRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}