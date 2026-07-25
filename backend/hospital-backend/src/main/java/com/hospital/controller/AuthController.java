package com.hospital.controller;

import com.hospital.config.JwtUtil;
import com.hospital.entity.Patient;
import com.hospital.repository.PatientRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private PatientRepository patientRepository;

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
        patientRepository.save(patient);

        return ResponseEntity.ok("Patient registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Patient patient = patientRepository.findByEmail(email).orElse(null);

        if (patient == null || !passwordEncoder.matches(password, patient.getPassword())) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        String token = jwtUtil.generateToken(patient.getEmail(), patient.getRole());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("name", patient.getName());
        response.put("email", patient.getEmail());
        response.put("role", patient.getRole());

        return ResponseEntity.ok(response);
    }
}