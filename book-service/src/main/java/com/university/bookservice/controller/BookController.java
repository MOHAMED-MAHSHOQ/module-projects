package com.university.bookservice.controller;

import com.university.bookservice.service.BookService;
import com.university.shared.dto.*;
import jakarta.validation.Valid;

import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
public class BookController {

    static final String BOOK_PATH = "/api/books";
    private static final String BOOK_PATH_ID = BOOK_PATH + "/{id}";

    private final BookService bookService;

    @GetMapping(BOOK_PATH)
    public ResponseEntity<ApiResponse<List<BookDto>>> getAllBooks() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Books fetched", bookService.getAllBooks()));
    }

    @GetMapping(BOOK_PATH_ID)
    public ResponseEntity<ApiResponse<BookDto>> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Book found", bookService.getBookById(id)));
    }

    @PostMapping(BOOK_PATH)
    public ResponseEntity<ApiResponse<BookDto>> addBook(@Valid @RequestBody BookCreateRequestDto dto, @RequestHeader("Current-User-Name") String currentUserName,
                                                        @RequestHeader("Email") String adminEmail) {
        log.info("The Current Username From Service A is : {}", currentUserName);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Book added", bookService.addBook(dto, currentUserName, adminEmail)));
    }

    @PutMapping(BOOK_PATH_ID)
    public ResponseEntity<ApiResponse<BookDto>> updateBook(@PathVariable Long id, @Valid @RequestBody BookUpdateRequestDto updateDto,
                                                           @RequestHeader("Current-User-Name") String currentUserName,
                                                           @RequestHeader("Email") String adminEmail) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Book updated", bookService.updateBook(id, updateDto, currentUserName, adminEmail)));
    }

    @PatchMapping(BOOK_PATH_ID)
    public ResponseEntity<ApiResponse<BookDto>> patchBook(@PathVariable Long id, @Valid @RequestBody BookPatchRequestDto patchDto,
                                                          @RequestHeader("Current-User-Name") String currentUserName,
                                                          @RequestHeader("Email") String adminEmail) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Book updated", bookService.patchBook(id, patchDto, currentUserName, adminEmail)));
    }

    @DeleteMapping(BOOK_PATH_ID)
    public ResponseEntity<ApiResponse<Void>> deleteBook(@PathVariable Long id, @RequestHeader("Current-User-Name") String currentUserName,
                                                        @RequestHeader("Email") String adminEmail) {
        bookService.deleteBook(id, currentUserName, adminEmail);
        return ResponseEntity.ok(new ApiResponse<>(true, "Book deleted", null));
    }

}
