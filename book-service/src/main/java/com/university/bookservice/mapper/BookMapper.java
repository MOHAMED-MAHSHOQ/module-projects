package com.university.bookservice.mapper;

import com.university.bookservice.model.Book;
import com.university.shared.dto.BookDto;
import com.university.shared.dto.BookSummaryDto;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookMapper {
  BookDto toDto(Book book);

  BookSummaryDto toSummaryDto(Book book);

  @Mapping(target = "id", ignore = true)
  Book toEntity(BookDto dto);

  List<BookSummaryDto> toSummaryDtoList(List<Book> books);
}
