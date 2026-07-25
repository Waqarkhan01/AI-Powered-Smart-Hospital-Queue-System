package com.hospital.service;

import com.hospital.entity.Hospital;
import com.hospital.entity.Patient;
import com.hospital.entity.Queue;
import com.hospital.entity.Queue.BedType;
import com.hospital.entity.Queue.Priority;
import com.hospital.entity.Queue.QueueStatus;
import com.hospital.repository.HospitalRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.repository.QueueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QueueService {

    private final QueueRepository queueRepository;
    private final PatientRepository patientRepository;
    private final HospitalRepository hospitalRepository;

    public Queue joinQueue(Long patientId, Long hospitalId, BedType bedType, Priority priority) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new RuntimeException("Hospital not found"));

        long waitingCount = queueRepository.countByHospitalIdAndStatus(hospitalId, QueueStatus.WAITING);

        Queue queue = new Queue();
        queue.setPatient(patient);
        queue.setHospital(hospital);
        queue.setBedType(bedType);
        queue.setPriority(priority);
        queue.setQueuePosition((int) waitingCount + 1);
        queue.setEstimatedWaitTime((int) waitingCount * 15);
        queue.setJoinedAt(LocalDateTime.now());

        return queueRepository.save(queue);
    }

    public List<Queue> getHospitalQueue(Long hospitalId) {
        return queueRepository.findByHospitalIdAndStatus(hospitalId, QueueStatus.WAITING);
    }

    public List<Queue> getPatientQueue(Long patientId) {
        return queueRepository.findByPatientIdAndStatus(patientId, QueueStatus.WAITING);
    }

    public Queue admitPatient(Long queueId) {
        Queue queue = queueRepository.findById(queueId)
                .orElseThrow(() -> new RuntimeException("Queue entry not found"));
        queue.setStatus(QueueStatus.ADMITTED);
        queue.setAdmittedAt(LocalDateTime.now());
        return queueRepository.save(queue);
    }

    public Queue cancelQueue(Long queueId) {
        Queue queue = queueRepository.findById(queueId)
                .orElseThrow(() -> new RuntimeException("Queue entry not found"));
        queue.setStatus(QueueStatus.CANCELLED);
        return queueRepository.save(queue);
    }
}
