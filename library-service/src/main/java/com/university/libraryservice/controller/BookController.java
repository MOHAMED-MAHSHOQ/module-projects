package com.university.libraryservice.controller;

import com.university.libraryservice.client.BookServiceClient;
import com.university.shared.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BookController {

    static final String BASE_PATH = "/api/books";
    private static final String BASE_PATH_ID = BASE_PATH + "/{id}";

    private final BookServiceClient bookServiceClient;


    @GetMapping(BASE_PATH)
    public ResponseEntity<ApiResponse<List<BookSummaryDto>>> getAllBooks() {
        return ResponseEntity.ok(bookServiceClient.getAllBooks());
    }

    @GetMapping(BASE_PATH_ID)
    public ResponseEntity<ApiResponse<BookDto>> getBookById(
            @PathVariable Long id) {
        return ResponseEntity.ok(bookServiceClient.getBookById(id));
    }

    @PostMapping(BASE_PATH)
    public ResponseEntity<ApiResponse<BookDto>> addBook(
            @RequestBody BookDto dto) {
        return ResponseEntity.ok(bookServiceClient.addBook(dto));
    }
}
