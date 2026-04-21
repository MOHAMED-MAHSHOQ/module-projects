package com.university.authserver;

import com.university.authserver.entity.AppUser;
import com.university.authserver.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class AuthServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServerApplication.class, args);

    }
    @Bean
    public CommandLineRunner loadInitialData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("alice").isEmpty()) {
                AppUser alice = new AppUser();
                alice.setUsername("alice");
                alice.setPassword(passwordEncoder.encode("pass123"));
                alice.setRole("STUDENT");
                userRepository.save(alice);

                System.out.println("Loaded user: alice");
            }

            if (userRepository.findByUsername("bob").isEmpty()) {
                AppUser bob = new AppUser();
                bob.setUsername("bob");
                bob.setPassword(passwordEncoder.encode("pass456"));
                bob.setRole("STUDENT");
                userRepository.save(bob);

                System.out.println("Loaded user: bob");
            }
        };
    }

}
