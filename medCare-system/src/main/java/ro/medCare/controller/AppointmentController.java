package ro.medCare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.medCare.exception.ResourceNotFoundException;
import ro.medCare.exception.ValidationException;
import ro.medCare.model.Appointment;
import ro.medCare.model.AppointmentStatus;
import ro.medCare.service.AppointmentService;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @Autowired
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        try {
            Appointment appointment = appointmentService.getAppointmentById(id);
            return ResponseEntity.ok(appointment);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody Appointment appointment) {
        try {
            Appointment createdAppointment = appointmentService.createAppointment(appointment);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAppointment);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating appointment: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointment) {
        try {
            appointment.setId(id);
            Appointment updatedAppointment = appointmentService.updateAppointment(appointment);
            return ResponseEntity.ok(updatedAppointment);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating appointment: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request) {
        try {
            Appointment updatedAppointment = appointmentService.updateAppointmentStatus(id, request.getStatus());
            return ResponseEntity.ok(updatedAppointment);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating appointment status: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        try {
            appointmentService.deleteAppointment(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting appointment: " + e.getMessage());
        }
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Appointment>> getAppointmentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<Appointment> appointments = appointmentService.getAppointmentsByDateRange(start, end);
        return ResponseEntity.ok(appointments);
    }

    private static class UpdateStatusRequest {
        private AppointmentStatus status;

        public AppointmentStatus getStatus() {
            return status;
        }

        public void setStatus(AppointmentStatus status) {
            this.status = status;
        }
    }
}