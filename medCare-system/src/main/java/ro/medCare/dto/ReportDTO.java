package ro.medCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ro.medCare.model.Appointment;
import ro.medCare.model.Doctor;
import ro.medCare.model.MedicalService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class ReportDTO {

    private List<Appointment> appointments;
    private Map<Doctor, Long> doctorStatistics;
    private Map<MedicalService, Long> serviceStatistics;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}