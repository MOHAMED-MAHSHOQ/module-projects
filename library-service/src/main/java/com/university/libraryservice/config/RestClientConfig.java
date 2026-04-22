package com.university.libraryservice.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;
@Configuration
public class RestClientConfig {
    @Value("${book-service.base-url}")
    private String bookServiceUrl;

    @Value("${book-service.credentials.username}")
    private String serviceUsername;

    @Value("${book-service.credentials.password}")
    private String servicePassword;

    @Bean
    public RestClient restClient() {
        return RestClient.builder()
                .baseUrl(bookServiceUrl)
                .defaultHeaders(headers -> {
                    headers.setBasicAuth(serviceUsername, servicePassword);
                    headers.setContentType(MediaType.APPLICATION_JSON);
                })
                .build();
    }
}
