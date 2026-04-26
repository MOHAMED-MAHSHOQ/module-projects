package com.university.bookservice.service;

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
      message.setSubject("Library System Alert: New Book Added");

      String emailBody =
              String.format(
                      """
                              Hello Superadmin,
                              
                              A new book has been added to the library database.
                              
                              Book Details:
                              - Book Title: %s
                              - Added By Username: %s
                              - Added By Email: %s
                              - Timestamp: %s
                              
                              Regards,
                              Library Automated System
                              """,
                      bookTitle, adminUsername, adminEmail, formattedTime);

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
      message.setSubject("Library System Alert: New Book Added");

      String emailBody =
              String.format(
                      """
                              Hello Superadmin,
                              
                              An existing book record has been updated in the library database.
                              
                              Target Book:
                              - Book ID: %d
                              - Original Title: %s
                              
                              New Updated Values:
                              - Title: %s
                              - Author: %s
                              
                              Action Performed By:
                              - Admin Username: %s
                              - Admin Email: %s
                              - Timestamp: %s
                              
                              Regards,
                              Library Automated System
                              """,
                      bookId,
                      bookTitle,
                      updates.getTitle(),
                      updates.getAuthor(),
                      adminUsername,
                      adminEmail,
                      formattedTime
              );

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
      message.setSubject(String.format("Library System Alert: Book Record Patched (ID: %d)", bookId));

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
      String emailBody =
              String.format(
                      """
                              Hello Superadmin,
                              
                              An existing book record has been partially updated in the library database.
                              
                              Target Book:
                              - Book ID: %d
                              - Original Title: %s
                              
                              Changes Applied:
                              %s
                              Action Performed By:
                              - Admin Username: %s
                              - Admin Email: %s
                              - Timestamp: %s
                              
                              Regards,
                              Library Automated System
                              """,
                      bookId,
                      originalBookTitle,
                      updatedFields.toString(),
                      adminUsername,
                      adminEmail,
                      formattedTime
              );

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
      message.setSubject(String.format("Library System Alert: Book Record Deleted (ID: %d)", bookId));

      String emailBody =
              String.format(
                      """
                              Hello Superadmin,
                              
                              A book record has been deleted from the library database.
                              
                              Deleted Book Details:
                              - Book ID: %d
                              - Deleted Title: %s
                              
                              Action Performed By:
                              - Admin Username: %s
                              - Admin Email: %s
                              - Timestamp: %s
                              
                              Regards,
                              Library Automated System
                              """,
                      bookId,
                      deletedTitle,
                      adminUsername,
                      adminEmail,
                      formattedTime
              );

      message.setText(emailBody);
      mailSender.send(message);

      log.info("Book deletion alert email successfully dispatched to {} for Book ID: {}", toEmail, bookId);

    } catch (Exception e) {
      log.error("Failed to send deletion email alert for Book ID: {}. Error: {}", bookId, e.getMessage());
    }
  }
}