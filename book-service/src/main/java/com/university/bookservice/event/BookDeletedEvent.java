package com.university.bookservice.event;

import java.time.LocalDateTime;

public record BookDeletedEvent(
        Long bookId,
        String deletedTitle,
        String adminUsername,
        String adminEmail,
        LocalDateTime timestamp
) {}