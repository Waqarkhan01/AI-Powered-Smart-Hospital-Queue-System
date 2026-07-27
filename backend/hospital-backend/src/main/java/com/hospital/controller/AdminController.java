package com.hospital.controller;

import com.hospital.entity.Admin;
import com.hospital.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Admin admin) {
        if (adminRepository.existsByEmail(admin.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered");
        }
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin.setRole("ADMIN");
        admin.setRegisteredOn(LocalDate.now());
        adminRepository.save(admin);
        return ResponseEntity.ok("Admin registered successfully");
    }

    @GetMapping
    public Iterable<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }
}