package com.university.shared.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.university.shared.utils.NormalizeSpaceDeserializer;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookPatchRequestDto {

    @JsonDeserialize(using = NormalizeSpaceDeserializer.class)
    @Size(min = 1, max = 25, message = "Title must be between 1 and 25 characters")
    private String title;

    @JsonDeserialize(using = NormalizeSpaceDeserializer.class)
    @Size(min = 1, max = 25, message = "Author must be between 1 and 25 characters")
    private String author;

    private Boolean available;
}