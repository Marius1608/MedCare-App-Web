package ro.medCare.service;

import org.springframework.stereotype.Component;
import ro.medCare.dto.ReportDTO;
import ro.medCare.model.Appointment;
import ro.medCare.model.Doctor;
import ro.medCare.model.MedicalService;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Map;

import java.time.format.DateTimeFormatter;

@Component
public class CSVReportExporter implements ReportExporter {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    @Override
    public File export(ReportDTO report) throws IOException {

        File csvFile = File.createTempFile("report_", ".csv");

        try (FileWriter writer = new FileWriter(csvFile)) {

            writer.write("ID,Patient Name,Doctor,Specialization,Date & Time,Service,Price,Duration,Status\n");

            for (Appointment appointment : report.getAppointments()) {
                writer.write(String.format("%d,%s,%s,%s,%s,%s,%.2f,%d,%s\n",
                        appointment.getId(),
                        appointment.getPatientName(),
                        appointment.getDoctor().getName(),
                        appointment.getDoctor().getSpecialization(),
                        appointment.getDateTime().format(DATE_FORMATTER),
                        appointment.getService().getName(),
                        appointment.getService().getPrice(),
                        appointment.getService().getDuration(),
                        appointment.getStatus().name()
                ));
            }

            writer.write("\nDoctor Statistics\n");
            writer.write("Doctor,Specialization,Appointments\n");

            for (Map.Entry<Doctor, Long> entry : report.getDoctorStatistics().entrySet()) {
                writer.write(String.format("%s,%s,%d\n",
                        entry.getKey().getName(),
                        entry.getKey().getSpecialization(),
                        entry.getValue()
                ));
            }

            writer.write("\nService Statistics\n");
            writer.write("Service,Price,Duration,Appointments\n");

            for (Map.Entry<MedicalService, Long> entry : report.getServiceStatistics().entrySet()) {
                writer.write(String.format("%s,%.2f,%d,%d\n",
                        entry.getKey().getName(),
                        entry.getKey().getPrice(),
                        entry.getKey().getDuration(),
                        entry.getValue()
                ));
            }
        }

        return csvFile;
    }
}