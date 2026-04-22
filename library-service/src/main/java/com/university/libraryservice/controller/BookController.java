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
@RequestMapping(BookController.BASE_PATH)
@RequiredArgsConstructor
public class BookController {

    static final String BASE_PATH = "/api/books";
    private static final String BASE_PATH_ID = BASE_PATH + "/{id}";

    private final BookServiceClient bookServiceClient;


    @GetMapping
    public ResponseEntity<ApiResponse<List<BookSummaryDto>>> getAllBooks(
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(bookServiceClient.getAllBooks());
    }

    @GetMapping(BASE_PATH + "/available")
    public ResponseEntity<ApiResponse<List<BookSummaryDto>>> getAvailableBooks(
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(bookServiceClient.getAvailableBooks());
    }

    @GetMapping(BASE_PATH_ID)
    public ResponseEntity<ApiResponse<BookDto>> getBookById(
            @PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(bookServiceClient.getBookById(id));
    }

    @GetMapping(BASE_PATH + "/search")
    public ResponseEntity<ApiResponse<List<BookSummaryDto>>> searchBooks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(bookServiceClient.searchBooks(title, author));
    }

    @PutMapping(BASE_PATH_ID + "/checkout")
    public ResponseEntity<ApiResponse<BookDto>> checkoutBook(
            @PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        System.out.println("Student '" + jwt.getSubject() + "' checking out book #" + id);
        return ResponseEntity.ok(bookServiceClient.updateAvailability(id, false));
    }

    @PutMapping(BASE_PATH_ID + "/return")
    public ResponseEntity<ApiResponse<BookDto>> returnBook(
            @PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(bookServiceClient.updateAvailability(id, true));
    }
}
