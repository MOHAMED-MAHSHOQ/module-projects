package com.university.bookservice.service;

import com.university.bookservice.event.BookCreatedEvent;
import com.university.bookservice.exceptions.BookNotFoundException;
import com.university.bookservice.mapper.BookMapper;
import com.university.bookservice.model.Book;
import com.university.bookservice.repository.BookRepository;
import com.university.shared.dto.BookDto;
import com.university.shared.dto.BookSummaryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final BookMapper bookMapper;
    private final ApplicationEventPublisher eventPublisher;

    public List<BookSummaryDto> getAllBooks() {
        return bookMapper.toSummaryDtoList(bookRepository.findAll());
    }

    public BookDto getBookById(Long id) {
        return bookRepository.findById(id)
                .map(bookMapper::toDto)
                .orElseThrow(() -> new BookNotFoundException(id));
    }
    @Transactional
    public BookDto addBook(BookDto dto, String currentUserName, String adminEmail) {
        Book saved = bookRepository.save(bookMapper.toEntity(dto));
        BookDto dto1 = bookMapper.toDto(saved);
        eventPublisher.publishEvent(new BookCreatedEvent(
                dto1.getTitle(),
                currentUserName,
                adminEmail,
                LocalDateTime.now()
        ));
        return dto1;

    }

}