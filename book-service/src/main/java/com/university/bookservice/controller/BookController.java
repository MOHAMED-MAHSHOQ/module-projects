package com.university.bookservice.controller;


import com.university.bookservice.service.BookService;
import com.university.shared.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping(BookController.BASE_PATH)
@RequiredArgsConstructor
public class BookController {

    static final String BASE_PATH             = "/api/books";
    private static final String BY_ID         = "/{id}";
    private static final String AVAILABLE     = "/available";
    private static final String SEARCH        = "/search";
    private static final String BY_ID_AVAILABLE = BY_ID + AVAILABLE;

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookSummaryDto>>> getAllBooks() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Books fetched", bookService.getAllBooks()));
    }

    @GetMapping(AVAILABLE)
    public ResponseEntity<ApiResponse<List<BookSummaryDto>>> getAvailableBooks() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Available books", bookService.getAvailableBooks()));
    }

    @GetMapping(BY_ID)
    public ResponseEntity<ApiResponse<BookDto>> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Book found", bookService.getBookById(id)));
    }

    @GetMapping(SEARCH)
    public ResponseEntity<ApiResponse<List<BookSummaryDto>>> searchBooks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Search complete", bookService.searchBooks(title, author)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookDto>> addBook(@RequestBody BookDto dto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Book added", bookService.addBook(dto)));
    }

    @PutMapping(BY_ID_AVAILABLE)
    public ResponseEntity<ApiResponse<BookDto>> updateAvailability(
            @PathVariable Long id,
            @RequestParam boolean available) {
        String message = available ? "Returned" : "Checked out";
        return ResponseEntity.ok(new ApiResponse<>(true, message, bookService.updateAvailability(id, available)));
    }
}