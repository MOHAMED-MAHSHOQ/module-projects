package com.university.authserver;

import com.university.authserver.entity.AppUser;
import com.university.authserver.entity.Role;
import com.university.authserver.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@Slf4j
public class AuthServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServerApplication.class, args);

    }
    @Bean
    public CommandLineRunner loadInitialData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("user1").isEmpty()) {
                AppUser user = new AppUser();
                user.setUsername("user1");
                user.setPassword(passwordEncoder.encode("pass123"));
                user.setRole(Role.USER);
                user.setEmail("user@gmail.com");
                userRepository.save(user);
                log.info("Default User : {} added", user.getUsername());
            }

            if (userRepository.findByUsername("admin1").isEmpty()) {
                AppUser admin = new AppUser();
                admin.setUsername("admin1");
                admin.setPassword(passwordEncoder.encode("pass123"));
                admin.setRole(Role.ADMIN);
                admin.setEmail("admin@gmail.com");
                userRepository.save(admin);
                log.info("Default Admin : {} added", admin.getUsername());

            }

            if (userRepository.findByUsername("super1").isEmpty()) {
                AppUser superadmin = new AppUser();
                superadmin.setUsername("super1");
                superadmin.setPassword(passwordEncoder.encode("pass123"));
                superadmin.setRole(Role.SUPERADMIN);
                superadmin.setEmail("superadmin@gmail.com");
                userRepository.save(superadmin);
                log.info("Default Super Admin : {} added", superadmin.getUsername());

            }
        };
    }

}
