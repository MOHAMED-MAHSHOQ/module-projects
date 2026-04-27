package com.university.shared.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;

    public ErrorResponse(int status, String error, String message) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.error = error;
        this.message = message;
    }

    public static ErrorResponse unauthorized(String msg) {
        return new ErrorResponse(401, "Unauthorized", msg);
    }

    public static ErrorResponse serverError(String msg) {
        return new ErrorResponse(500, "Internal Server Error", msg);
    }
}
