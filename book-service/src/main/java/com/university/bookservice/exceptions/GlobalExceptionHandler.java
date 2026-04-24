package com.university.bookservice.exceptions;

import com.university.shared.dto.ApiResponse;
import com.university.shared.dto.ErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(BookNotFoundException.class)
  public ResponseEntity<ApiResponse<Void>> handleNotFound(BookNotFoundException ex) {
    return ResponseEntity.status(404).body(new ApiResponse<>(false, ex.getMessage(), null));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
    return ResponseEntity.status(500).body(ErrorResponse.serverError("Unexpected error"));
  }
}
