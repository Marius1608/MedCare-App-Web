package ro.medCare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ro.medCare.dto.LoginRequest;
import ro.medCare.dto.LoginResponse;
import ro.medCare.exception.ValidationException;
import ro.medCare.model.User;
import ro.medCare.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {

            User user = userService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
            LoginResponse response = new LoginResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getName(),
                    user.getRole(),
                    "dummy-token" 
            );

            return ResponseEntity.ok(response);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Authentication failed: " + e.getMessage());
        }
    }
}