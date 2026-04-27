package com.university.bookservice.event;

import com.university.shared.dto.BookUpdateRequestDto;

import java.time.LocalDateTime;

public record BookUpdateEvent(
        Long id, String bookTitle, BookUpdateRequestDto updates, String adminUsername, String adminEmail, LocalDateTime timestamp) {
}

