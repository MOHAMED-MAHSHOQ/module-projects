package com.university.authserver.service;

import com.university.authserver.dto.UserDto;
import com.university.authserver.entity.AppUser;
import com.university.authserver.entity.Role;
import com.university.authserver.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void createUser(UserDto request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        Role requestedRole = Role.valueOf(request.getRole().toUpperCase());
        if (requestedRole == Role.SUPERADMIN && userRepository.existsByRole(Role.SUPERADMIN)) {
            throw new IllegalArgumentException("A SUPERADMIN already exists in the system. Only one is allowed.");
        }
        AppUser newUser = new AppUser();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(Role.valueOf(request.getRole().toUpperCase()));

        userRepository.save(newUser);
    }

    @Transactional
    public void updateUserRole(Long userId, String newRole) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Role requestedRole = Role.valueOf(newRole.toUpperCase());
        if (requestedRole == Role.SUPERADMIN && user.getRole() != Role.SUPERADMIN) {
            if (userRepository.existsByRole(Role.SUPERADMIN)) {
                throw new IllegalArgumentException("A SUPERADMIN already exists in the system. Only one is allowed.");
            }
        }

        user.setRole(Role.valueOf(newRole.toUpperCase()));
        userRepository.save(user);
    }
}