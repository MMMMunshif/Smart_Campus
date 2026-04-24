package com.smartcampus.backend.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.util.UriUtils;

import com.smartcampus.backend.dto.AuthResponse;
import com.smartcampus.backend.service.AuthService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class GoogleOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final AuthService authService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public GoogleOAuth2SuccessHandler(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        try {
            OAuth2User principal = (OAuth2User) authentication.getPrincipal();
            String email = principal.getAttribute("email");
            String name = principal.getAttribute("name");
            String picture = principal.getAttribute("picture");

            if (email == null || email.isBlank()) {
                response.sendRedirect(frontendUrl + "/signin?oauthError=missing_email");
                return;
            }

            AuthResponse authResponse = authService.signinWithGoogle(email, name, picture);

            UriComponentsBuilder redirectBuilder = UriComponentsBuilder.fromUriString(frontendUrl + "/oauth2/success")
                    .queryParam("token", authResponse.getToken())
                    .queryParam("tokenType", authResponse.getTokenType())
                    .queryParam("role", authResponse.getRole().name())
                    .queryParam("email", authResponse.getEmail())
                    .queryParam("name", authResponse.getName())
                    ;

            if (authResponse.getProfileImageUrl() != null && !authResponse.getProfileImageUrl().isBlank()) {
                redirectBuilder.queryParam("profileImageUrl", authResponse.getProfileImageUrl());
            }

            String redirectUrl = redirectBuilder.build().toUriString();

            response.sendRedirect(redirectUrl);
        } catch (ResponseStatusException ex) {
            String reason = UriUtils.encode(ex.getReason(), java.nio.charset.StandardCharsets.UTF_8);
            response.sendRedirect(frontendUrl + "/signin?oauthError=" + reason);
        }
    }
}
