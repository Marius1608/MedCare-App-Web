package ro.medCare.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ro.medCare.model.Doctor;

import java.util.List;

@Repository
public interface DoctorDAO extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecialization(String specialization);
}