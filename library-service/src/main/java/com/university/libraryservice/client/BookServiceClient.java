package com.university.libraryservice.client;

import com.university.shared.dto.*;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

@Component
public class BookServiceClient {

    private static final String BOOK_PATH = "/api/books";
    private static final String BOOK_PATH_ID = "/api/books/{id}";


    private final RestClient restClient;

    public BookServiceClient(RestClient restClient) {
        this.restClient = restClient;
    }


    public ApiResponse<List<BookSummaryDto>> getAllBooks() {
        return restClient.get().uri(BOOK_PATH).retrieve()
                .body(new ParameterizedTypeReference<ApiResponse<List<BookSummaryDto>>>() {
                });
    }

    public ApiResponse<List<BookSummaryDto>> getAvailableBooks() {
        return restClient.get().uri(BOOK_PATH+"/available").retrieve()
                .body(new ParameterizedTypeReference<ApiResponse<List<BookSummaryDto>>>() {
                });
    }

    public ApiResponse<BookDto> getBookById(Long id) {
        return restClient.get().uri(BOOK_PATH_ID, id).retrieve()
                .body(new ParameterizedTypeReference<ApiResponse<BookDto>>() {
                });
    }

    public ApiResponse<List<BookSummaryDto>> searchBooks(String title, String author) {
        String uri = BOOK_PATH+"/search" + (title != null ? "?title=" + title
                : author != null ? "?author=" + author : "");
        return restClient.get().uri(uri).retrieve()
                .body(new ParameterizedTypeReference<ApiResponse<List<BookSummaryDto>>>() {
                });
    }

    public ApiResponse<BookDto> updateAvailability(Long id, boolean available) {
        return restClient.put().uri(BOOK_PATH+"/{id}/available" + "?available=" + available, id)
                .retrieve().body(new ParameterizedTypeReference<ApiResponse<BookDto>>() {
                });
    }
}
