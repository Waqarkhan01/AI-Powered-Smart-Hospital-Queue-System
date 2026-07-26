package com.hospital.controller;

import com.hospital.entity.Bed;
import com.hospital.repository.BedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beds")
public class BedController {

    @Autowired
    private BedRepository bedRepository;

    @GetMapping
    public List<Bed> getAllBeds() {
        return bedRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bed> getBedById(@PathVariable Long id) {
        return bedRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Bed createBed(@RequestBody Bed bed) {
        return bedRepository.save(bed);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bed> updateBed(@PathVariable Long id, @RequestBody Bed updated) {
        return bedRepository.findById(id)
                .map(existing -> {
                    existing.setBedNumber(updated.getBedNumber());
                    existing.setBedType(updated.getBedType());
                    existing.setStatus(updated.getStatus());
                    existing.setHospital(updated.getHospital());
                    return ResponseEntity.ok(bedRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBed(@PathVariable Long id) {
        if (!bedRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bedRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}