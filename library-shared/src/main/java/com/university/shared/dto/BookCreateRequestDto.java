package com.university.shared.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.university.shared.utils.NormalizeSpaceDeserializer;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookCreateRequestDto {
    @JsonDeserialize(using = NormalizeSpaceDeserializer.class)
    @NotBlank(message = "Title is required")
    @Size(max = 25, message = "Title must be at most 25 characters")
    private String title;

    @JsonDeserialize(using = NormalizeSpaceDeserializer.class)
    @NotBlank(message = "Author is required")
    @Size(max = 25, message = "Author must be at most 25 characters")
    private String author;

    @NotBlank(message = "ISBN is required")
    @Digits(integer = 13, fraction = 0, message = "ISBN must be a numeric value with up to 13 digits")
    private String isbn;
}
