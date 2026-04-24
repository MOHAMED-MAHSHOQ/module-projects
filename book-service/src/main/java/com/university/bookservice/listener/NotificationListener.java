package com.university.bookservice.listener;

import com.university.bookservice.event.BookCreatedEvent;
import java.time.format.DateTimeFormatter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationListener {

  private final JavaMailSender mailSender;

  @Value("${app.notification.super-admin-email}")
  private String superadminEmail;

  @Async
  @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
  public void onBookCreated(BookCreatedEvent event) {
    log.info("Background Event caught! Preparing to send email for book: {}", event.bookTitle());

    try {
      DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
      String formattedTime = event.timestamp().format(formatter);

      SimpleMailMessage message = new SimpleMailMessage();
      message.setFrom("mahshoq.work@gmail.com");
      message.setTo(superadminEmail);
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
              event.bookTitle(), event.adminUsername(), event.adminEmail(), formattedTime);

      message.setText(emailBody);

      mailSender.send(message);
      log.info("Email successfully dispatched to Mailtrap for Superadmin: {}", superadminEmail);

    } catch (Exception e) {
      log.error("Failed to send email alert: {}", e.getMessage());
    }
  }
}
