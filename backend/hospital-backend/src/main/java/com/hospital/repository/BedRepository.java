package com.hospital.repository;

import com.hospital.entity.Bed;
import com.hospital.entity.Bed.BedStatus;
import com.hospital.entity.Bed.BedType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BedRepository extends JpaRepository<Bed, Long> {
    List<Bed> findByHospitalId(Long hospitalId);
    List<Bed> findByHospitalIdAndStatus(Long hospitalId, BedStatus status);
    List<Bed> findByHospitalIdAndBedType(Long hospitalId, BedType bedType);
    long countByHospitalIdAndStatus(Long hospitalId, BedStatus status);
}
