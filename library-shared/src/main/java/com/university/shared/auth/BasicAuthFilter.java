package com.university.shared.auth;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Base64;
import java.util.List;

public class BasicAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Basic ")) {
            reject(response, "Missing Basic Auth header");
            return;
        }

        String base64Part = authHeader.substring(6);
        String decoded = new String(Base64.getDecoder().decode(base64Part));
        String[] parts = decoded.split(":", 2);

        if (parts.length != 2) { reject(response, "Malformed credentials"); return; }

        boolean ok = BasicAuthCredentials.SERVICE_USERNAME.equals(parts[0])
                && BasicAuthCredentials.SERVICE_PASSWORD.equals(parts[1]);

        if (!ok) { reject(response, "Invalid service credentials"); return; }

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(parts[0], null, List.of());
        SecurityContextHolder.getContext().setAuthentication(auth);

        filterChain.doFilter(request, response);
    }

    private void reject(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"" + message + "\"}");
    }
}
