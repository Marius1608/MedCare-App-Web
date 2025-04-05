package ro.medCare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ro.medCare.model.UserRole;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private Long id;
    private String username;
    private String name;
    private UserRole role;
    private String token;
}