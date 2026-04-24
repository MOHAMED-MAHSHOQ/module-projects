package com.university.bookservice.event;

import java.time.LocalDateTime;

public record BookCreatedEvent(
    String bookTitle, String adminUsername, String adminEmail, LocalDateTime timestamp) {}
