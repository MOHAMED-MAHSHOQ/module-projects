package com.university.libraryservice.client;

import com.university.shared.dto.*;

import java.util.List;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class BookServiceClient {

    private static final String BOOK_PATH = "/api/books";
    private static final String BOOK_PATH_ID = BOOK_PATH + "/{id}";

    private final RestClient restClient;

    public BookServiceClient(RestClient restClient) {
        this.restClient = restClient;
    }

    public ApiResponse<List<BookDto>> getAllBooks() {
        return restClient.get().uri(BOOK_PATH).retrieve().body(new ParameterizedTypeReference<>() {
        });
    }

    public ApiResponse<BookDto> getBookById(Long id) {
        return restClient
                .get()
                .uri(BOOK_PATH_ID, id)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {
                });
    }

    public ApiResponse<BookDto> addBook(
            BookCreateRequestDto dto, String currentUserName, String adminEmail) {
        return restClient
                .post()
                .uri(BOOK_PATH)
                .header("Current-User-Name", currentUserName)
                .header("Email", adminEmail)
                .body(dto)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {
                });
    }

    public ApiResponse<BookDto> updateBook(Long id, BookUpdateRequestDto updateDto, String currentUserName, String adminEmail) {
        return restClient
                .put()
                .uri(BOOK_PATH_ID, id)
                .header("Current-User-Name", currentUserName)
                .header("Email", adminEmail)
                .body(updateDto)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {
                });
    }

    public ApiResponse<BookDto> patchBook(Long id, BookPatchRequestDto patchDto, String currentUserName, String adminEmail) {
        return restClient
                .patch()
                .uri(BOOK_PATH_ID, id)
                .header("Current-User-Name", currentUserName)
                .header("Email", adminEmail)
                .body(patchDto)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {
                });
    }

    public ApiResponse<Void> deleteBook(Long id, String currentUserName, String adminEmail) {
        return restClient
                .delete()
                .uri(BOOK_PATH_ID, id)
                .header("Current-User-Name", currentUserName)
                .header("Email", adminEmail)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {
                });
    }
}

