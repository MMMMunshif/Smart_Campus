package com.smartcampus.backend.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriUtils;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class GoogleOAuth2FailureHandler implements AuthenticationFailureHandler {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationFailure(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception) throws IOException, ServletException {
        String reason = UriUtils.encode(mapReason(exception.getMessage()), java.nio.charset.StandardCharsets.UTF_8);
        response.sendRedirect(frontendUrl + "/signin?oauthError=" + reason);
    }

    private String mapReason(String rawMessage) {
        if (rawMessage == null || rawMessage.isBlank()) {
            return "Google sign-in failed. Please try again.";
        }

        String message = rawMessage.toLowerCase();
        if (message.contains("deleted_client")) {
            return "Google OAuth client is disabled or deleted. Update Google Cloud credentials.";
        }
        if (message.contains("redirect_uri_mismatch")) {
            return "Google redirect URI mismatch. Verify callback URL configuration.";
        }
        if (message.contains("invalid_token_response") || message.contains("401 unauthorized")) {
            return "Google token exchange failed. Verify client ID and secret.";
        }

        return rawMessage;
    }
}
