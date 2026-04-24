package com.university.bookservice.exceptions;

public class BookNotFoundException extends RuntimeException {
  public BookNotFoundException(Long id) {
    super("Book " + id + " not found");
  }
}
