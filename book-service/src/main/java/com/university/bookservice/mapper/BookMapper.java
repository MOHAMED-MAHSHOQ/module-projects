package com.university.bookservice.mapper;

import com.university.bookservice.model.Book;
import com.university.shared.dto.BookCreateRequestDto;
import com.university.shared.dto.BookDto;
import java.util.List;

import com.university.shared.dto.BookPatchRequestDto;
import com.university.shared.dto.BookUpdateRequestDto;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface BookMapper {
  BookDto toDto(Book book);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "available", ignore = true)
  Book toEntity(BookCreateRequestDto dto);

  List<BookDto> toDtoList(List<Book> books);

  void updateEntityFromDto(BookUpdateRequestDto dto, @MappingTarget Book entity);

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  void patchEntityFromDto(BookPatchRequestDto dto, @MappingTarget Book entity);
}
