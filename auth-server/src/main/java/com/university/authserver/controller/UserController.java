package com.university.authserver.controller;

import com.university.authserver.dto.UserDto;
import com.university.authserver.dto.UserResponseDto;
import com.university.authserver.service.UserService;
import java.util.List;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @PreAuthorize("hasRole('SUPERADMIN')")
  @PostMapping
  public ResponseEntity<String> createUser(@Valid @RequestBody UserDto request) {
    userService.createUser(request);
    return ResponseEntity.ok("User created successfully");
  }

  @PreAuthorize("hasRole('SUPERADMIN')")
  @PutMapping("/{id}/role")
  public ResponseEntity<String> updateUserRole(
      @PathVariable Long id, @RequestParam String newRole) {
    userService.updateUserRole(id, newRole);
    return ResponseEntity.ok("User role updated successfully");
  }

  @PreAuthorize("hasRole('SUPERADMIN')")
  @GetMapping
  public ResponseEntity<List<UserResponseDto>> getAllUsers() {
    return ResponseEntity.ok(userService.getAllUsers());
  }
}
