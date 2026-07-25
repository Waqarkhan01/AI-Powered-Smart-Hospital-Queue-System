package com.hospital.repository;

import com.hospital.entity.Queue;
import com.hospital.entity.Queue.QueueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface QueueRepository extends JpaRepository<Queue, Long> {
    List<Queue> findByHospitalIdAndStatus(Long hospitalId, QueueStatus status);
    List<Queue> findByPatientIdAndStatus(Long patientId, QueueStatus status);
    Optional<Queue> findByPatientIdAndHospitalIdAndStatus(Long patientId, Long hospitalId, QueueStatus status);
    long countByHospitalIdAndStatus(Long hospitalId, QueueStatus status);
}
