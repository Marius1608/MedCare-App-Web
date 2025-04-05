package ro.medCare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.medCare.dto.ReportDTO;
import ro.medCare.model.Appointment;
import ro.medCare.model.Doctor;
import ro.medCare.model.MedicalService;

import java.io.File;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;


@Service
public class ReportService {

    private final AppointmentService appointmentService;
    private final CSVReportExporter csvExporter;
    private final XMLReportExporter xmlExporter;

    @Autowired
    public ReportService(AppointmentService appointmentService,
                         CSVReportExporter csvExporter,
                         XMLReportExporter xmlExporter) {
        this.appointmentService = appointmentService;
        this.csvExporter = csvExporter;
        this.xmlExporter = xmlExporter;
    }

    public ReportDTO generateReport(LocalDateTime startDate, LocalDateTime endDate) {

        List<Appointment> appointments = appointmentService.getAppointmentsByDateRange(startDate, endDate);
        Map<Doctor, Long> doctorStatistics = appointmentService.getMostRequestedDoctors();
        Map<MedicalService, Long> serviceStatistics = appointmentService.getMostRequestedServices();

        return new ReportDTO(appointments, doctorStatistics, serviceStatistics, startDate, endDate);
    }

    public File exportToCSV(ReportDTO report) throws IOException {
        return csvExporter.export(report);
    }

    public File exportToXML(ReportDTO report) throws Exception {
        return xmlExporter.export(report);
    }

}