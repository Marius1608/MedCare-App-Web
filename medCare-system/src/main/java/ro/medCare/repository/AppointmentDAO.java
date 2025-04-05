package ro.medCare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ro.medCare.model.Appointment;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentDAO extends JpaRepository<Appointment, Long> {

    List<Appointment> findByDateTimeBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = ?1 AND a.dateTime BETWEEN ?2 AND ?3")
    List<Appointment> findByDoctorIdAndDateTimeBetween(Long doctorId, LocalDateTime startDateTime, LocalDateTime endDateTime);
}