package com.hospital.controller;

import com.hospital.entity.Hospital;
import com.hospital.repository.HospitalRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {

    @Autowired
    private HospitalRepository hospitalRepository;

    @GetMapping
    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hospital> getHospitalById(@PathVariable Long id) {
        return hospitalRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Hospital createHospital(@Valid @RequestBody Hospital hospital) {
        return hospitalRepository.save(hospital);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hospital> updateHospital(@PathVariable Long id, @Valid @RequestBody Hospital updated) {
        return hospitalRepository.findById(id)
                .map(existing -> {
                    existing.setName(updated.getName());
                    existing.setAddress(updated.getAddress());
                    existing.setCity(updated.getCity());
                    existing.setPhone(updated.getPhone());
                    existing.setRating(updated.getRating());
                    existing.setTotalBeds(updated.getTotalBeds());
                    existing.setAvailableBeds(updated.getAvailableBeds());
                    return ResponseEntity.ok(hospitalRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHospital(@PathVariable Long id) {
        if (!hospitalRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        hospitalRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}