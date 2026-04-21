package com.university.bookservice.service;

import com.university.bookservice.exceptions.BookNotFoundException;
import com.university.bookservice.mapper.BookMapper;
import com.university.bookservice.model.Book;
import com.university.bookservice.repository.BookRepository;
import com.university.shared.dto.BookDto;
import com.university.shared.dto.BookSummaryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final BookMapper bookMapper;

    public List<BookSummaryDto> getAllBooks() {
        return bookMapper.toSummaryDtoList(bookRepository.findAll());
    }

    public List<BookSummaryDto> getAvailableBooks() {
        return bookMapper.toSummaryDtoList(bookRepository.findByAvailable(true));
    }

    public BookDto getBookById(Long id) {
        return bookRepository.findById(id)
                .map(bookMapper::toDto)
                .orElseThrow(() -> new BookNotFoundException(id));
    }

    public List<BookSummaryDto> searchBooks(String title, String author) {
        List<Book> results;
        if (title != null) {
            results = bookRepository.findByTitleContainingIgnoreCase(title);
        } else if (author != null) {
            results = bookRepository.findByAuthorContainingIgnoreCase(author);
        } else {
            results = bookRepository.findAll();
        }
        return bookMapper.toSummaryDtoList(results);
    }

    public BookDto addBook(BookDto dto) {
        Book saved = bookRepository.save(bookMapper.toEntity(dto));
        return bookMapper.toDto(saved);
    }

    public BookDto updateAvailability(Long id, boolean available) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));
        book.setAvailable(available);
        return bookMapper.toDto(bookRepository.save(book));
    }
}