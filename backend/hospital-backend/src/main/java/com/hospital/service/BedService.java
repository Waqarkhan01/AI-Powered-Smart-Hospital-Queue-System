package com.hospital.service;

import com.hospital.entity.Bed;
import com.hospital.entity.Bed.BedStatus;
import com.hospital.entity.Bed.BedType;
import com.hospital.entity.Hospital;
import com.hospital.repository.BedRepository;
import com.hospital.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BedService {

    private final BedRepository bedRepository;
    private final HospitalRepository hospitalRepository;

    public List<Bed> getBedsByHospital(Long hospitalId) {
        return bedRepository.findByHospitalId(hospitalId);
    }

    public List<Bed> getAvailableBeds(Long hospitalId) {
        return bedRepository.findByHospitalIdAndStatus(hospitalId, BedStatus.AVAILABLE);
    }

    public Bed createBed(Long hospitalId, Bed bed) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
        bed.setHospital(hospital);
        return bedRepository.save(bed);
    }

    public Bed updateBedStatus(Long bedId, BedStatus status) {
        Bed bed = bedRepository.findById(bedId)
                .orElseThrow(() -> new RuntimeException("Bed not found"));
        bed.setStatus(status);
        return bedRepository.save(bed);
    }

    public long countAvailableBeds(Long hospitalId) {
        return bedRepository.countByHospitalIdAndStatus(hospitalId, BedStatus.AVAILABLE);
    }
}
