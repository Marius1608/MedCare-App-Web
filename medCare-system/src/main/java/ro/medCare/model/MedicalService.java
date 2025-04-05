package ro.medCare.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "medical_services")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private int duration;

    @Override
    public String toString() {
        return name + " - " + price + " RON";
    }
}