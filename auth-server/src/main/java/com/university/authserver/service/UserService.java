package com.university.authserver.service;

import com.university.authserver.dto.UserDto;
import com.university.authserver.dto.UserResponseDto;
import com.university.authserver.entity.AppUser;
import com.university.authserver.entity.Role;
import com.university.authserver.repository.UserRepository;

import java.util.List;

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
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }
        Role requestedRole = Role.valueOf(request.getRole().toUpperCase());
        if (requestedRole == Role.SUPERADMIN && userRepository.existsByRole(Role.SUPERADMIN)) {
            throw new IllegalArgumentException("A SUPERADMIN already exists. Only one is allowed.");
        }

        AppUser newUser = new AppUser();
        newUser.setUsername(request.getUsername());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setEmail(request.getEmail());
        newUser.setRole(requestedRole);

        userRepository.save(newUser);
    }

    @Transactional
    public void updateUserRole(Long userId, String newRole) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        if (user.getRole() == Role.SUPERADMIN) {
            throw new IllegalArgumentException("Cannot change role of a SUPERADMIN");
        }

        Role requestedRole;
        try {
            requestedRole = Role.valueOf(newRole.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role provided: " + newRole);
        }

        if (user.getRole() == requestedRole) {
            throw new IllegalArgumentException("User already has the role: " + requestedRole);
        }

        if (requestedRole == Role.SUPERADMIN && userRepository.existsByRole(Role.SUPERADMIN)) {
            throw new IllegalArgumentException("A SUPERADMIN already exists. Only one is allowed.");
        }

        user.setRole(requestedRole);
    }

    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() != Role.SUPERADMIN)
                .map(
                        appUser -> {
                            UserResponseDto dto = new UserResponseDto();
                            dto.setId(appUser.getId());
                            dto.setUsername(appUser.getUsername());
                            dto.setEmail(appUser.getEmail());
                            dto.setRole(appUser.getRole().name());
                            return dto;
                        })
                .toList();
    }
}
