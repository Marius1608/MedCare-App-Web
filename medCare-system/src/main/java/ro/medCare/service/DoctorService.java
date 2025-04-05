package ro.medCare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.medCare.exception.ResourceNotFoundException;
import ro.medCare.model.Appointment;
import ro.medCare.model.Doctor;
import ro.medCare.repository.AppointmentDAO;
import ro.medCare.repository.DoctorDAO;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class DoctorService {

    private final DoctorDAO doctorRepository;
    private final AppointmentDAO appointmentRepository;

    @Autowired
    public DoctorService(DoctorDAO doctorRepository, AppointmentDAO appointmentRepository) {
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctor(Doctor doctor) {
        if (!doctorRepository.existsById(doctor.getId())) {
            throw new ResourceNotFoundException("Doctor not found!");
        }
        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(Long id) {
        if (!doctorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor not found!");
        }
        doctorRepository.deleteById(id);
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found!"));
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public List<Doctor> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization);
    }

    public boolean checkAvailability(Long doctorId, LocalDateTime dateTime, int durationMinutes) {

        Doctor doctor = getDoctorById(doctorId);
        String[] workHoursParts = doctor.getWorkHours().split("-");

        if (workHoursParts.length != 2) {
            return false;
        }

        LocalTime startWorkHour = LocalTime.parse(workHoursParts[0].trim());
        LocalTime endWorkHour = LocalTime.parse(workHoursParts[1].trim());
        LocalTime appointmentTime = dateTime.toLocalTime();

        if (appointmentTime.isBefore(startWorkHour) ||
                appointmentTime.plusMinutes(durationMinutes).isAfter(endWorkHour)) {
            return false;
        }

        LocalDateTime endDateTime = dateTime.plusMinutes(durationMinutes);
        List<Appointment> overlappingAppointments = appointmentRepository
                .findByDoctorIdAndDateTimeBetween(doctorId, dateTime, endDateTime);

        return overlappingAppointments.isEmpty();
    }
}