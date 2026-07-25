package com.hospital.service;

import com.hospital.entity.Hospital;
import com.hospital.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HospitalService {

    private final HospitalRepository hospitalRepository;

    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findByActiveTrue();
    }

    public Hospital getHospitalById(Long id) {
        return hospitalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));
    }

    public Hospital createHospital(Hospital hospital) {
        return hospitalRepository.save(hospital);
    }

    public Hospital updateHospital(Long id, Hospital hospital) {
        Hospital existing = getHospitalById(id);
        existing.setName(hospital.getName());
        existing.setAddress(hospital.getAddress());
        existing.setCity(hospital.getCity());
        existing.setPhone(hospital.getPhone());
        existing.setEmail(hospital.getEmail());
        existing.setRating(hospital.getRating());
        existing.setLatitude(hospital.getLatitude());
        existing.setLongitude(hospital.getLongitude());
        return hospitalRepository.save(existing);
    }

    public void deleteHospital(Long id) {
        Hospital existing = getHospitalById(id);
        existing.setActive(false);
        hospitalRepository.save(existing);
    }

    public List<Hospital> getHospitalsByCity(String city) {
        return hospitalRepository.findByCity(city);
    }
}
