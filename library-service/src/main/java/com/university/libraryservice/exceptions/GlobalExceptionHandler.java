package com.university.libraryservice.exceptions;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.university.shared.dto.ErrorResponse;
import java.util.stream.Collectors;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;

@RestControllerAdvice
public class GlobalExceptionHandler {

  private final ObjectMapper objectMapper = new ObjectMapper();

  @ExceptionHandler(HttpClientErrorException.class)
  public ResponseEntity<ErrorResponse> handleBookServiceError(HttpClientErrorException ex) {
    String message = extractMessage(ex);
    return ResponseEntity.status(ex.getStatusCode())
        .body(new ErrorResponse(ex.getStatusCode().value(), "Book service error", message));
  }

  private String extractMessage(HttpClientErrorException ex) {
    String body = ex.getResponseBodyAsString();
    if (body != null && !body.isBlank()) {
      try {
        JsonNode root = objectMapper.readTree(body);
        if (root.hasNonNull("message") && !root.get("message").asText().isBlank()) {
          return root.get("message").asText();
        }
        if (root.hasNonNull("error") && !root.get("error").asText().isBlank()) {
          return root.get("error").asText();
        }
      } catch (Exception ignored) {
        return body;
      }
      return body;
    }
    return ex.getStatusText();
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<ErrorResponse> handleForbidden(AccessDeniedException ex) {
    return ResponseEntity.status(403).body(ErrorResponse.unauthorized("Access denied"));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
    String message =
        ex.getBindingResult().getFieldErrors().stream()
            .map(err -> err.getDefaultMessage() == null ? "Invalid value" : err.getDefaultMessage())
            .collect(Collectors.joining("; "));
    return ResponseEntity.status(400).body(new ErrorResponse(400, "Bad Request", message));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
    return ResponseEntity.status(500).body(ErrorResponse.serverError("Unexpected error"));
  }
}
