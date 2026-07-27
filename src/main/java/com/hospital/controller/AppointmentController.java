package com.hospital.controller;

import com.hospital.entity.Appointment;
import com.hospital.entity.Doctor;
import com.hospital.entity.Notification;
import com.hospital.entity.Patient;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.NotificationRepository;
import com.hospital.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @PostMapping
    public ResponseEntity<?> bookAppointment(@RequestParam Long patientId,
                                              @RequestParam Long doctorId,
                                              @RequestBody Appointment appointmentDetails) {
        Patient patient = patientRepository.findById(patientId).orElse(null);
        Doctor doctor = doctorRepository.findById(doctorId).orElse(null);

        if (patient == null || doctor == null) {
            return ResponseEntity.badRequest().body("Invalid patient or doctor");
        }

        appointmentDetails.setPatient(patient);
        appointmentDetails.setDoctor(doctor);
        appointmentDetails.setStatus("PENDING");

        Appointment saved = appointmentRepository.save(appointmentDetails);

        createNotification(patient, "Your appointment with " + doctor.getName() + " has been requested.");

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/patient/{patientId}")
    public List<Appointment> getPatientAppointments(@PathVariable Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Appointment> getDoctorAppointments(@PathVariable Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return appointmentRepository.findById(id)
                .map(appt -> {
                    appt.setStatus(status);
                    Appointment saved = appointmentRepository.save(appt);

                    String message = switch (status) {
                        case "CONFIRMED" -> "Your appointment with " + appt.getDoctor().getName() + " has been confirmed.";
                        case "CANCELLED" -> "Your appointment with " + appt.getDoctor().getName() + " has been cancelled.";
                        case "COMPLETED" -> "Your appointment with " + appt.getDoctor().getName() + " is now complete.";
                        default -> null;
                    };
                    if (message != null) {
                        createNotification(appt.getPatient(), message);
                    }

                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelAppointment(@PathVariable Long id) {
        if (!appointmentRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        appointmentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void createNotification(Patient patient, String message) {
        Notification notification = new Notification();
        notification.setPatient(patient);
        notification.setMessage(message);
        notification.setType("APP");
        notification.setSent(true);
        notificationRepository.save(notification);
    }
}