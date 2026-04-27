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
            if (repo.count() == 0) {
                repo.save(new Book("Clean Code", "Robert Martin", "1234567890"));
                repo.save(new Book("The Pragmatic Programmer", "David Thomas", "1234567890123"));
                repo.save(new Book("Design Patterns", "Gang of Four", "123456789"));
                repo.save(new Book("Spring in Action", "Craig Walls", "12345678"));
                System.out.println("Sample books loaded");
            } else {
                System.out.println("Books already exist, skipping seed");
            }
        };
    }
}
