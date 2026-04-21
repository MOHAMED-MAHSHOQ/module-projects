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

    static final String BASE_PATH         = "/api/books";
    private static final String AVAILABLE = "/available";
    private static final String BY_ID     = "/{id}";
    private static final String SEARCH    = "/search";
    private static final String CHECKOUT  = "/{id}/checkout";
    private static final String RETURN_BOOK = "/{id}/return";

    private final BookServiceClient bookServiceClient;


    @GetMapping
    public ResponseEntity<ApiResponse<List<BookSummaryDto>>> getAllBooks(
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(bookServiceClient.getAllBooks());
    }

    @GetMapping(AVAILABLE)
    public ResponseEntity<ApiResponse<List<BookSummaryDto>>> getAvailableBooks(
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(bookServiceClient.getAvailableBooks());
    }

    @GetMapping(BY_ID)
    public ResponseEntity<ApiResponse<BookDto>> getBookById(
            @PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(bookServiceClient.getBookById(id));
    }

    @GetMapping(SEARCH)
    public ResponseEntity<ApiResponse<List<BookSummaryDto>>> searchBooks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(bookServiceClient.searchBooks(title, author));
    }

    @PutMapping(CHECKOUT)
    public ResponseEntity<ApiResponse<BookDto>> checkoutBook(
            @PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        System.out.println("Student '" + jwt.getSubject() + "' checking out book #" + id);
        return ResponseEntity.ok(bookServiceClient.updateAvailability(id, false));
    }

    @PutMapping(RETURN_BOOK)
    public ResponseEntity<ApiResponse<BookDto>> returnBook(
            @PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(bookServiceClient.updateAvailability(id, true));
    }
}
