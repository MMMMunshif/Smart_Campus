package com.smartcampus.backend.config;

import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.Role;
import com.smartcampus.backend.repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        System.out.println("OAuth Success - Email: " + email);
        System.out.println("OAuth Success - Name: " + name);

        if (email != null && !email.isBlank()) {
            Optional<User> existingUser = userRepository.findByEmail(email);

            User user;
            if (existingUser.isPresent()) {
                user = existingUser.get();
                if (user.getName() == null || user.getName().isBlank()) {
                    user.setName(name != null ? name : "Google User");
                }
            } else {
                user = new User();
                user.setName(name != null ? name : "Google User");
                user.setEmail(email);
                user.setPassword("GOOGLE_OAUTH_USER");
                user.setRole(Role.USER);
                user.setProfileCompleted(false);
            }

            userRepository.save(user);
        }

        response.sendRedirect("http://localhost:5173/dashboard");
    }
}