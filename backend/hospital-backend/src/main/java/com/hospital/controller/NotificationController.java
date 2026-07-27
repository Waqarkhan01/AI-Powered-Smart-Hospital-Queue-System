package com.hospital.controller;

import com.hospital.entity.Notification;
import com.hospital.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping("/patient/{patientId}")
    public List<Notification> getPatientNotifications(@PathVariable Long patientId) {
        return notificationRepository.findByPatientId(patientId);
    }
}