package com.university.bookservice.mapper;

import com.university.bookservice.model.Book;
import com.university.shared.dto.BookCreateRequestDto;
import com.university.shared.dto.BookDto;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookMapper {
  BookDto toDto(Book book);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "available", ignore = true)
  Book toEntity(BookCreateRequestDto dto);

  List<BookDto> toDtoList(List<Book> books);
}
