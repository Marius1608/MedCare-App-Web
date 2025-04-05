package ro.medCare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.medCare.dto.ReportDTO;
import ro.medCare.service.ReportService;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public ResponseEntity<ReportDTO> generateReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        ReportDTO report = reportService.generateReport(startDate, endDate);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportToCSV(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        try {
            ReportDTO report = reportService.generateReport(startDate, endDate);
            File csvFile = reportService.exportToCSV(report);

            byte[] fileContent = Files.readAllBytes(csvFile.toPath());
            csvFile.delete(); // Șterge fișierul temporar

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", "report.csv");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(fileContent);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/export/xml")
    public ResponseEntity<byte[]> exportToXML(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        try {
            ReportDTO report = reportService.generateReport(startDate, endDate);
            File xmlFile = reportService.exportToXML(report);

            byte[] fileContent = Files.readAllBytes(xmlFile.toPath());
            xmlFile.delete(); // Șterge fișierul temporar

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/xml"));
            headers.setContentDispositionFormData("attachment", "report.xml");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(fileContent);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}