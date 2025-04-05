package ro.medCare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.medCare.exception.ResourceNotFoundException;
import ro.medCare.exception.ValidationException;
import ro.medCare.model.*;
import ro.medCare.repository.AppointmentDAO;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentDAO appointmentRepository;
    private final DoctorService doctorService;

    @Autowired
    public AppointmentService(AppointmentDAO appointmentRepository, DoctorService doctorService) {
        this.appointmentRepository = appointmentRepository;
        this.doctorService = doctorService;
    }

    public Appointment createAppointment(Appointment appointment) {

        if (!doctorService.checkAvailability(
                appointment.getDoctor().getId(),
                appointment.getDateTime(),
                appointment.getService().getDuration())) {
            throw new ValidationException("Doctor is not available in the specified time slot!");
        }

        appointment.setStatus(AppointmentStatus.NEW);

        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointment(Appointment appointment) {
        if (!appointmentRepository.existsById(appointment.getId())) {
            throw new ResourceNotFoundException("Appointment not found!");
        }

        Appointment existingAppointment = appointmentRepository.findById(appointment.getId()).orElse(null);

        if (existingAppointment != null &&
                ((!existingAppointment.getDateTime().equals(appointment.getDateTime())) ||
                        (!existingAppointment.getDoctor().getId().equals(appointment.getDoctor().getId())) ||
                        (!existingAppointment.getService().getId().equals(appointment.getService().getId())))) {

            if (!doctorService.checkAvailability(
                    appointment.getDoctor().getId(),
                    appointment.getDateTime(),
                    appointment.getService().getDuration())) {
                throw new ValidationException("Doctor is not available in the specified time slot!");
            }
        }

        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointmentStatus(Long id, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found!"));

        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Appointment not found!");
        }
        appointmentRepository.deleteById(id);
    }

    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found!"));
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> getAppointmentsByDateRange(LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByDateTimeBetween(start, end);
    }

    public Map<Doctor, Long> getMostRequestedDoctors() {

        List<Appointment> appointments = appointmentRepository.findAll();

        Map<Doctor, Long> doctorCounts = appointments.stream()
                .collect(Collectors.groupingBy(Appointment::getDoctor, Collectors.counting()));

        return doctorCounts.entrySet().stream().sorted(Map.Entry.<Doctor, Long>comparingByValue().reversed()).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));
    }

    public Map<MedicalService, Long> getMostRequestedServices() {
        List<Appointment> appointments = appointmentRepository.findAll();

        Map<MedicalService, Long> serviceCounts = appointments.stream()
                .collect(Collectors.groupingBy(Appointment::getService, Collectors.counting()));

        return serviceCounts.entrySet().stream().sorted(Map.Entry.<MedicalService, Long>comparingByValue().reversed()).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));
    }
}