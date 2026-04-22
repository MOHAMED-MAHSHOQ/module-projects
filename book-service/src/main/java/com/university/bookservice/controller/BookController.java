package com.university.bookservice.controller;


import com.university.bookservice.service.BookService;
import com.university.shared.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BookController {

    static final String BOOK_PATH = "/api/books";
    private static final String BOOK_PATH_ID = BOOK_PATH + "/{id}";

    private final BookService bookService;

    @GetMapping(BOOK_PATH)
    public ResponseEntity<ApiResponse<List<BookSummaryDto>>> getAllBooks() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Books fetched", bookService.getAllBooks()));
    }

    @GetMapping(BOOK_PATH_ID)
    public ResponseEntity<ApiResponse<BookDto>> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(true, "Book found", bookService.getBookById(id)));
    }


    @PostMapping(BOOK_PATH)
    public ResponseEntity<ApiResponse<BookDto>> addBook(@RequestBody BookDto dto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Book added", bookService.addBook(dto)));
    }

}