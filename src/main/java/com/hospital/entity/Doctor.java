package com.hospital.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Enter a valid email")
    @Column(unique = true)
    private String email;

    private String phone;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    private String qualification;

    private Integer experienceYears;

    @Column(nullable = false)
    private String password;

    private String role = "DOCTOR";

    private LocalDate registeredOn = LocalDate.now();
}