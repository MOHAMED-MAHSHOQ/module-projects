package com.university.shared.auth;
import java.util.Base64;

public class BasicAuthHeaderBuilder {

    public static String buildHeader(String username, String password) {
        String credentials = username + ":" + password;
        String encoded = Base64.getEncoder().encodeToString(credentials.getBytes());
        return "Basic " + encoded;
    }

    public static String buildServiceHeader() {
        return buildHeader(
                BasicAuthCredentials.SERVICE_USERNAME,
                BasicAuthCredentials.SERVICE_PASSWORD
        );
    }
}
