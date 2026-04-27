package com.university.bookservice.service;

import com.university.bookservice.constants.EmailTemplateConstants;
import com.university.shared.dto.BookPatchRequestDto;
import com.university.shared.dto.BookUpdateRequestDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${app.notification.from-email}")
    private String fromEmail;

    public void sendBookCreationAlert(String toEmail, String bookTitle, String adminUsername, String adminEmail, String formattedTime) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(EmailTemplateConstants.NEW_BOOK_SUBJECT);
            String emailBody = String.format(EmailTemplateConstants.NEW_BOOK_BODY, bookTitle, adminUsername, adminEmail, formattedTime);
            message.setText(emailBody);
            mailSender.send(message);

            log.info("Email successfully dispatched to {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send email alert: {}", e.getMessage());
        }
    }


    public void sendBookUpdateAlert(String toEmail, Long bookId, String bookTitle, BookUpdateRequestDto updates, String adminUsername, String adminEmail, String formattedTime) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(EmailTemplateConstants.UPDATE_BOOK_SUBJECT);
            String emailBody = String.format(EmailTemplateConstants.UPDATE_BOOK_BODY, bookId, bookTitle, updates.getTitle(), updates.getAuthor(),
                            adminUsername, adminEmail, formattedTime);
            message.setText(emailBody);
            mailSender.send(message);

            log.info("Email successfully dispatched to {}", toEmail);

        } catch (Exception e) {
            log.error("Failed to send email alert: {}", e.getMessage());
        }
    }

    public void sendBookPatchedAlert(String toEmail, Long bookId, String originalBookTitle, BookPatchRequestDto updates, String adminUsername, String adminEmail, String formattedTime) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(String.format(EmailTemplateConstants.PATCH_BOOK_SUBJECT, bookId));

            StringBuilder updatedFields = new StringBuilder();

            if (updates.getTitle() != null) {
                updatedFields.append("  - Title updated to: ").append(updates.getTitle()).append("\n");
            }
            if (updates.getAuthor() != null) {
                updatedFields.append("  - Author updated to: ").append(updates.getAuthor()).append("\n");
            }
            if (updates.getAvailable() != null) {
                updatedFields.append("  - Availability status changed to: ").append(updates.getAvailable()).append("\n");
            }
            if (updatedFields.isEmpty()) {
                updatedFields.append("  - (No tracked fields were modified)\n");
            }
            String emailBody = String.format(EmailTemplateConstants.PATCH_BOOK_BODY, bookId, originalBookTitle, updatedFields,
                            adminUsername, adminEmail, formattedTime);
            message.setText(emailBody);
            mailSender.send(message);

            log.info("Book patch alert email successfully dispatched to {} for Book ID: {}", toEmail, bookId);

        } catch (Exception e) {
            log.error("Failed to send patch email alert for Book ID: {}. Error: {}", bookId, e.getMessage());
        }
    }

    public void sendBookDeletionAlert(String toEmail, Long bookId, String deletedTitle, String adminUsername, String adminEmail, String formattedTime) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(String.format(EmailTemplateConstants.DELETE_BOOK_SUBJECT, bookId));
            String emailBody = String.format(EmailTemplateConstants.DELETE_BOOK_BODY, bookId, deletedTitle, adminUsername, adminEmail, formattedTime);
            message.setText(emailBody);
            mailSender.send(message);

            log.info("Book deletion alert email successfully dispatched to {} for Book ID: {}", toEmail, bookId);

        } catch (Exception e) {
            log.error("Failed to send deletion email alert for Book ID: {}. Error: {}", bookId, e.getMessage());
        }
    }
}