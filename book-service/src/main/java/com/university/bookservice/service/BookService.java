package com.university.bookservice.service;

import com.university.bookservice.event.BookCreatedEvent;
import com.university.bookservice.event.BookUpdateEvent;
import com.university.bookservice.exceptions.BookNotFoundException;
import com.university.bookservice.exceptions.DuplicateIsbnException;
import com.university.bookservice.mapper.BookMapper;
import com.university.bookservice.model.Book;
import com.university.bookservice.repository.BookRepository;
import com.university.shared.dto.BookCreateRequestDto;
import com.university.shared.dto.BookDto;

import java.time.LocalDateTime;
import java.util.List;

import com.university.shared.dto.BookUpdateRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final BookMapper bookMapper;
    private final ApplicationEventPublisher eventPublisher;

    public List<BookDto> getAllBooks() {
        return bookMapper.toDtoList(bookRepository.findAll());
    }

    public BookDto getBookById(Long id) {
        return bookRepository
                .findById(id)
                .map(bookMapper::toDto)
                .orElseThrow(() -> new BookNotFoundException(id));
    }

    @Transactional
    public BookDto addBook(BookCreateRequestDto dto, String currentUserName, String adminEmail) {
        if (bookRepository.existsByIsbn(dto.getIsbn())) {
            throw new DuplicateIsbnException(dto.getIsbn());
        }

        Book book = bookMapper.toEntity(dto);
        book.setAvailable(true);
        Book saved = bookRepository.save(book);

        BookDto dto1 = bookMapper.toDto(saved);
        eventPublisher.publishEvent(
                new BookCreatedEvent(dto1.getTitle(), currentUserName, adminEmail, LocalDateTime.now()));
        return dto1;
    }

    @Transactional
    public BookDto updateBook(Long id, BookUpdateRequestDto updateDto, String currentUsername, String adminEmail) {
        String prevTitile = bookRepository.findById(id).orElseThrow(()->new BookNotFoundException(id)).getTitle();
        Book existingBook = bookRepository.findById(id).orElseThrow(() -> new BookNotFoundException(id));

        bookMapper.updateEntityFromDto(updateDto, existingBook);

        eventPublisher.publishEvent(new BookUpdateEvent(id,prevTitile, updateDto, currentUsername, adminEmail, LocalDateTime.now()));
        return bookMapper.toDto(existingBook);

    }

}
