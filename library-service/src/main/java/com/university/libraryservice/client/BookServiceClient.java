package com.university.libraryservice.client;

import com.university.shared.dto.*;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Component
public class BookServiceClient {

    private static final String BOOK_PATH = "/api/books";
    private static final String BOOK_PATH_ID = BOOK_PATH+"/{id}";


    private final RestClient restClient;

    public BookServiceClient(RestClient restClient) {
        this.restClient = restClient;
    }


    public ApiResponse<List<BookSummaryDto>> getAllBooks() {
        return restClient.get().uri(BOOK_PATH).retrieve()
                .body(new ParameterizedTypeReference<ApiResponse<List<BookSummaryDto>>>() {
                });
    }


    public ApiResponse<BookDto> getBookById(Long id) {
        return restClient.get().uri(BOOK_PATH_ID, id).retrieve()
                .body(new ParameterizedTypeReference<ApiResponse<BookDto>>() {
                });
    }

    public ApiResponse<BookDto> addBook(BookDto dto) {
        return restClient.post().uri(BOOK_PATH).body(dto).retrieve()
                .body(new ParameterizedTypeReference<ApiResponse<BookDto>>() {
                });
    }
}
