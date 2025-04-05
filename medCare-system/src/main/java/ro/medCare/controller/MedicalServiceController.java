package ro.medCare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.medCare.exception.ResourceNotFoundException;
import ro.medCare.exception.ValidationException;
import ro.medCare.model.MedicalService;
import ro.medCare.service.MedicalServiceService;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class MedicalServiceController {

    private final MedicalServiceService medicalServiceService;

    @Autowired
    public MedicalServiceController(MedicalServiceService medicalServiceService) {
        this.medicalServiceService = medicalServiceService;
    }

    @GetMapping
    public ResponseEntity<List<MedicalService>> getAllMedicalServices() {
        List<MedicalService> services = medicalServiceService.getAllMedicalServices();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalService> getMedicalServiceById(@PathVariable Long id) {
        try {
            MedicalService service = medicalServiceService.getMedicalServiceById(id);
            return ResponseEntity.ok(service);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createMedicalService(@RequestBody MedicalService service) {
        try {
            MedicalService createdService = medicalServiceService.createMedicalService(service);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdService);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating medical service: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedicalService(@PathVariable Long id, @RequestBody MedicalService service) {
        try {
            service.setId(id);
            MedicalService updatedService = medicalServiceService.updateMedicalService(service);
            return ResponseEntity.ok(updatedService);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating medical service: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicalService(@PathVariable Long id) {
        try {
            medicalServiceService.deleteMedicalService(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting medical service: " + e.getMessage());
        }
    }
}