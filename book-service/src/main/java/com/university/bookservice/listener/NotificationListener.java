package com.university.bookservice.listener;

import com.university.bookservice.event.BookCreatedEvent;
import com.university.bookservice.event.BookDeletedEvent;
import com.university.bookservice.event.BookPatchedEvent;
import com.university.bookservice.event.BookUpdateEvent;
import com.university.bookservice.service.EmailService;

import java.time.format.DateTimeFormatter;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationListener {
    private final EmailService emailService;

    @Value("${app.notification.super-admin-email}")
    private String superadminEmail;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onBookCreated(BookCreatedEvent event) {
        log.info("Background Event caught! Triggering email service for book: {}", event.bookTitle());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedTime = event.timestamp().format(formatter);

        emailService.sendBookCreationAlert(
                superadminEmail,
                event.bookTitle(),
                event.adminUsername(),
                event.adminEmail(),
                formattedTime);
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onBookUpdated(BookUpdateEvent event) {
        log.info("Background Event caught! Triggering email service for book update: {}", event.id());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String formattedTime = event.timestamp().format(formatter);

        emailService.sendBookUpdateAlert(superadminEmail, event.id(), event.bookTitle(), event.updates(), event.adminUsername(), event.adminEmail(), formattedTime);

    }

    @Async
    @EventListener
    public void handleBookUpdated(BookPatchedEvent event) {
        log.info("Audit log: Book ID {} updated by {}", event.bookId(), event.adminUsername());

        emailService.sendBookPatchedAlert(
                superadminEmail,
                event.bookId(),
                event.originalTitle(),
                event.updates(),
                event.adminUsername(),
                event.adminEmail(),
                event.timestamp().toString()
        );
    }

    @Async
    @EventListener
    public void handleBookDeleted(BookDeletedEvent event) {
        log.warn("Audit log: Book '{}' (ID: {}) was DELETED by {}", event.deletedTitle(), event.bookId(), event.adminUsername());

        emailService.sendBookDeletionAlert(
                superadminEmail,
                event.bookId(),
                event.deletedTitle(),
                event.adminUsername(),
                event.adminEmail(),
                event.timestamp().toString()
        );
    }
}
