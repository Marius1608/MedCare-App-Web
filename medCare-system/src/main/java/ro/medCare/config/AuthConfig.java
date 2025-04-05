package ro.medCare.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import ro.medCare.model.User;
import ro.medCare.model.UserRole;
import ro.medCare.repository.UserDAO;

import jakarta.annotation.PostConstruct;

@Configuration
public class AuthConfig {

    private final UserDAO userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthConfig(UserDAO userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void initAdmin() {
        if (userRepository.findAll().isEmpty()) {
            User adminUser = new User();
            adminUser.setName("Administrator");
            adminUser.setUsername("admin");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setRole(UserRole.ADMIN);

            try {
                userRepository.save(adminUser);
                System.out.println("Succes! Username: admin, Password: admin123");
            } catch (Exception e) {
                System.err.println("Error !" + e.getMessage());
            }
        }
    }
}