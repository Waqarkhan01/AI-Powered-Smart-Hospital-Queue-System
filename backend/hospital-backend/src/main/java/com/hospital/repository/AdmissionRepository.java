package com.hospital.repository;

import com.hospital.entity.Admission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdmissionRepository extends JpaRepository<Admission, Long> {

    List<Admission> findByPatientId(Long patientId);

    List<Admission> findByHospitalId(Long hospitalId);

    List<Admission> findByStatus(String status);
}