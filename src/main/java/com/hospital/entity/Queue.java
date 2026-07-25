package com.hospital.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "queue")
public class Queue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @Enumerated(EnumType.STRING)
    private BedType bedType;

    @Enumerated(EnumType.STRING)
    private QueueStatus status = QueueStatus.WAITING;

    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;

    private Integer queuePosition;
    private Integer estimatedWaitTime;
    private LocalDateTime joinedAt = LocalDateTime.now();
    private LocalDateTime admittedAt;

    public enum QueueStatus {
        WAITING, ADMITTED, CANCELLED
    }

    public enum Priority {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public enum BedType {
        ICU, GENERAL, EMERGENCY, VENTILATOR
    }
}
