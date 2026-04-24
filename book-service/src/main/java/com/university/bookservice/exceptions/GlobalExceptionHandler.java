package com.university.bookservice.exceptions;

import com.university.shared.dto.ApiResponse;
import com.university.shared.dto.ErrorResponse;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(BookNotFoundException.class)
  public ResponseEntity<ApiResponse<Void>> handleNotFound(BookNotFoundException ex) {
    return ResponseEntity.status(404).body(new ApiResponse<>(false, ex.getMessage(), null));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
    String message =
        ex.getBindingResult().getFieldErrors().stream()
            .map(err -> err.getDefaultMessage() == null ? "Invalid value" : err.getDefaultMessage())
            .collect(Collectors.joining("; "));
    return ResponseEntity.status(400).body(new ErrorResponse(400, "Bad Request", message));
  }

  @ExceptionHandler(DuplicateIsbnException.class)
  public ResponseEntity<ErrorResponse> handleDuplicateIsbn(DuplicateIsbnException ex) {
    return ResponseEntity.status(409).body(new ErrorResponse(409, "Conflict", ex.getMessage()));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
    return ResponseEntity.status(500).body(ErrorResponse.serverError("Unexpected error"));
  }
}
