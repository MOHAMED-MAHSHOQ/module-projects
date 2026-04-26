package com.university.bookservice.service;

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

}
