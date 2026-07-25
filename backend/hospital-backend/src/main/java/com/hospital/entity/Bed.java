package com.hospital.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "beds")
public class Bed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @Enumerated(EnumType.STRING)
    private BedType bedType;

    @Enumerated(EnumType.STRING)
    private BedStatus status = BedStatus.AVAILABLE;

    private String bedNumber;

    public enum BedType {
        ICU, GENERAL, EMERGENCY, VENTILATOR
    }

    public enum BedStatus {
        AVAILABLE, OCCUPIED, MAINTENANCE
    }
}
