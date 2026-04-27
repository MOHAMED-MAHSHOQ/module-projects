package com.university.bookservice.event;

import com.university.shared.dto.BookPatchRequestDto;

import java.time.LocalDateTime;

public record BookPatchedEvent(
        Long bookId, String originalTitle, BookPatchRequestDto updates, String adminUsername, String adminEmail, LocalDateTime timestamp
) {
}
