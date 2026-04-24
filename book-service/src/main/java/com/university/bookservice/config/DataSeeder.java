package com.university.bookservice.config;

import com.university.bookservice.model.Book;
import com.university.bookservice.repository.BookRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;

@Configuration
public class DataSeeder {
  @Bean
  public CommandLineRunner seedBooks(BookRepository repo) {
    return args -> {
      if (repo.count() == 0) { // ← only insert if table is empty
        repo.save(new Book("Clean Code", "Robert Martin", "978-0132350884"));
        repo.save(new Book("The Pragmatic Programmer", "David Thomas", "978-0135957059"));
        repo.save(new Book("Design Patterns", "Gang of Four", "978-0201633610"));
        repo.save(new Book("Spring in Action", "Craig Walls", "978-1617294945"));
        System.out.println("Sample books loaded");
      } else {
        System.out.println("Books already exist, skipping seed");
      }
    };
  }
}
