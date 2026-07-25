package com.hospital.controller;

import com.hospital.entity.Bed;
import com.hospital.entity.Bed.BedStatus;
import com.hospital.service.BedService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/beds")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BedController {

    private final BedService bedService;

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<Bed>> getBedsByHospital(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(bedService.getBedsByHospital(hospitalId));
    }

    @GetMapping("/hospital/{hospitalId}/available")
    public ResponseEntity<List<Bed>> getAvailableBeds(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(bedService.getAvailableBeds(hospitalId));
    }

    @PostMapping("/hospital/{hospitalId}")
    public ResponseEntity<Bed> createBed(@PathVariable Long hospitalId, @RequestBody Bed bed) {
        return ResponseEntity.ok(bedService.createBed(hospitalId, bed));
    }

    @PutMapping("/{bedId}/status")
    public ResponseEntity<Bed> updateBedStatus(@PathVariable Long bedId, @RequestParam BedStatus status) {
        return ResponseEntity.ok(bedService.updateBedStatus(bedId, status));
    }

    @GetMapping("/hospital/{hospitalId}/count")
    public ResponseEntity<Long> countAvailableBeds(@PathVariable Long hospitalId) {
        return ResponseEntity.ok(bedService.countAvailableBeds(hospitalId));
    }
}
