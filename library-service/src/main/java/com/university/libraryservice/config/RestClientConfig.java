package com.university.libraryservice.config;
import com.university.shared.auth.BasicAuthHeaderBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
@Configuration
public class RestClientConfig {
    @Bean
    public RestClient restClientConfig(){
        return RestClient.builder()
                .defaultHeader("Authorization", BasicAuthHeaderBuilder.buildServiceHeader())
                .defaultHeader("Content-Type", "application/json")
                .build();
    }
}
