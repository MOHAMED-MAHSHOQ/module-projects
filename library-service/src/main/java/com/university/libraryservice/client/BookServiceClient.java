package com.university.libraryservice.client;

import com.university.shared.dto.*;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Component
public class BookServiceClient {
    private static final String BASE_URL = "http://localhost:8082";
    private static final String BOOKS = "/api/books";
    private static final String AVAILABLE = "/api/books/available";
    private static final String SEARCH = "/api/books/search";
    private static final String BY_ID = "/api/books/{id}";
    private static final String AVAILABILITY = "/api/books/{id}/available";

    private final RestClient restClient;

    public BookServiceClient(RestClient restClientConfig) {
        this.restClient = RestClient.builder()
                .baseUrl(BASE_URL)
                .build();
    }


    public ApiResponse<List<BookSummaryDto>> getAllBooks() {
        return restClient.get().uri(BOOKS).retrieve()
                .body(new ParameterizedTypeReference<ApiResponse<List<BookSummaryDto>>>() {
                });
    }

    public ApiResponse<List<BookSummaryDto>> getAvailableBooks() {
        return restClient.get().uri(AVAILABLE).retrieve()
                .body(new ParameterizedTypeReference<ApiResponse<List<BookSummaryDto>>>() {
                });
    }

    public ApiResponse<BookDto> getBookById(Long id) {
        return restClient.get().uri(BY_ID, id).retrieve()
                .body(new ParameterizedTypeReference<ApiResponse<BookDto>>() {
                });
    }

    public ApiResponse<List<BookSummaryDto>> searchBooks(String title, String author) {
        String uri = SEARCH + (title != null ? "?title=" + title
                : author != null ? "?author=" + author : "");
        return restClient.get().uri(uri).retrieve()
                .body(new ParameterizedTypeReference<ApiResponse<List<BookSummaryDto>>>() {
                });
    }

    public ApiResponse<BookDto> updateAvailability(Long id, boolean available) {
        return restClient.put().uri(AVAILABILITY + "?available=" + available, id)
                .retrieve().body(new ParameterizedTypeReference<ApiResponse<BookDto>>() {
                });
    }
}
