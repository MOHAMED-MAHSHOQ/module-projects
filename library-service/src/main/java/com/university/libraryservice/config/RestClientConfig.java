package com.university.libraryservice.config;
import com.university.libraryservice.client.BookServiceClient;
import com.university.shared.auth.BasicAuthHeaderBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
@Configuration
public class RestClientConfig {
    @Value("${book-service.base-url}")
    private String bookServiceUrl;

    @Bean
    public RestClient restClientConfig(){
        return RestClient.builder()
                .baseUrl(bookServiceUrl)
                .defaultHeader("Authorization", BasicAuthHeaderBuilder.buildServiceHeader())
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
}
