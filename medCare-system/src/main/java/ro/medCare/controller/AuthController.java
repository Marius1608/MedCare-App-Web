package ro.medCare.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ro.medCare.dto.LoginRequest;
import ro.medCare.dto.LoginResponse;
import ro.medCare.exception.ValidationException;
import ro.medCare.model.User;
import ro.medCare.service.JwtTokenService;
import ro.medCare.service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final JwtTokenService jwtTokenService;

    @Autowired
    public AuthController(UserService userService, JwtTokenService jwtTokenService) {
        this.userService = userService;
        this.jwtTokenService = jwtTokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Autentificare prin UserService
            User user = userService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());

            // Generare token JWT
            String token = jwtTokenService.generateToken(user);

            // Construire și returnare răspuns
            LoginResponse response = new LoginResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getName(),
                    user.getRole(),
                    token
            );

            return ResponseEntity.ok(response);
        } catch (ValidationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Authentication failed: " + e.getMessage());
        }
    }
}