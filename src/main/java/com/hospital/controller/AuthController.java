package com.hospital.controller;

import com.hospital.config.JwtUtil;
import com.hospital.entity.Admin;
import com.hospital.entity.Doctor;
import com.hospital.entity.Patient;
import com.hospital.repository.AdminRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody Patient patient) {
        if (patientRepository.existsByEmail(patient.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered");
        }
        patient.setPassword(passwordEncoder.encode(patient.getPassword()));
        patient.setRole("PATIENT");
        patient.setRegisteredOn(LocalDate.now());
        patientRepository.save(patient);
        return ResponseEntity.ok("Patient registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Patient patient = patientRepository.findByEmail(email).orElse(null);
        if (patient != null) {
            if (!passwordEncoder.matches(password, patient.getPassword())) {
                return ResponseEntity.status(401).body("Invalid email or password");
            }
            return buildLoginResponse(patient.getId(), patient.getName(), patient.getEmail(), "PATIENT");
        }

        Doctor doctor = doctorRepository.findByEmail(email).orElse(null);
        if (doctor != null) {
            if (!passwordEncoder.matches(password, doctor.getPassword())) {
                return ResponseEntity.status(401).body("Invalid email or password");
            }
            return buildLoginResponse(doctor.getId(), doctor.getName(), doctor.getEmail(), "DOCTOR");
        }

        Admin admin = adminRepository.findByEmail(email).orElse(null);
        if (admin != null) {
            if (!passwordEncoder.matches(password, admin.getPassword())) {
                return ResponseEntity.status(401).body("Invalid email or password");
            }
            return buildLoginResponse(admin.getId(), admin.getName(), admin.getEmail(), "ADMIN");
        }

        return ResponseEntity.status(401).body("Invalid email or password");
    }

    private ResponseEntity<?> buildLoginResponse(Long id, String name, String email, String role) {
        String token = jwtUtil.generateToken(email, role);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("id", id);
        response.put("name", name);
        response.put("email", email);
        response.put("role", role);

        return ResponseEntity.ok(response);
    }
}