package com.university.libraryservice.controller;

import com.university.libraryservice.client.BookServiceClient;
import com.university.shared.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class BookController {

    static final String BASE_PATH = "/api/books";
    private static final String BASE_PATH_ID = BASE_PATH + "/{id}";

    private final BookServiceClient bookServiceClient;

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping(BASE_PATH)
    public ResponseEntity<ApiResponse<List<BookSummaryDto>>> getAllBooks() {
        return ResponseEntity.ok(bookServiceClient.getAllBooks());
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping(BASE_PATH_ID)
    public ResponseEntity<ApiResponse<BookDto>> getBookById(
            @PathVariable Long id) {
        return ResponseEntity.ok(bookServiceClient.getBookById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(BASE_PATH)
    public ResponseEntity<ApiResponse<BookDto>> addBook(
            @RequestBody BookDto dto, @AuthenticationPrincipal Jwt jwt) {
        String currentUserName = jwt.getClaimAsString("sub");
        String adminEmail = jwt.getClaimAsString("email");

        return ResponseEntity.ok(bookServiceClient.addBook(dto,currentUserName,adminEmail));
    }
}
