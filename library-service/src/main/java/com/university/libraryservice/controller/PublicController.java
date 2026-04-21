package com.university.libraryservice.controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(PublicController.BASE_PATH)
public class PublicController {

    static final String BASE_PATH = "/api/public";
    private static final String HEALTH = "/health";

    @GetMapping(HEALTH)
    public String health() {
        return "{\"status\": \"Library Service running\"}";
    }
}
