package com.university.bookservice.constants;

public final class EmailTemplateConstants {
    public static final String NEW_BOOK_SUBJECT = "Library System Alert: New Book Added";
    public static final String NEW_BOOK_BODY = """
            Hello Superadmin,
            
            A new book has been added to the library database.
            
            Book Details:
            - Book Title: %s
            - Added By Username: %s
            - Added By Email: %s
            - Timestamp: %s
            
            Regards,
            Library Automated System
            """;
    public static final String UPDATE_BOOK_SUBJECT = "Library System Alert: Book Record Updated (ID: %d)";
    public static final String UPDATE_BOOK_BODY = """
            Hello Superadmin,
            
            An existing book record has been updated in the library database.
            
            Target Book:
            - Book ID: %d
            - Original Title: %s
            
            New Updated Values:
            - Title: %s
            - Author: %s
            
            Action Performed By:
            - Admin Username: %s
            - Admin Email: %s
            - Timestamp: %s
            
            Regards,
            Library Automated System
            """;
    public static final String PATCH_BOOK_SUBJECT = "Library System Alert: Book Record Patched (ID: %d)";
    public static final String PATCH_BOOK_BODY = """
            Hello Superadmin,
            
            An existing book record has been partially updated in the library database.
            
            Target Book:
            - Book ID: %d
            - Original Title: %s
            
            Changes Applied:
            %s
            Action Performed By:
            - Admin Username: %s
            - Admin Email: %s
            - Timestamp: %s
            
            Regards,
            Library Automated System
            """;
    public static final String DELETE_BOOK_SUBJECT = "Library System Alert: Book Record Deleted (ID: %d)";
    public static final String DELETE_BOOK_BODY = """
            Hello Superadmin,
            
            A book record has been deleted from the library database.
            
            Deleted Book Details:
            - Book ID: %d
            - Deleted Title: %s
            
            Action Performed By:
            - Admin Username: %s
            - Admin Email: %s
            - Timestamp: %s
            
            Regards,
            Library Automated System
            """;
    private EmailTemplateConstants() {
    }
}

