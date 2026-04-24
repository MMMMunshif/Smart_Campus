package com.smartcampus.backend.controller;

import java.util.Map;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.backend.dto.AuthResponse;
import com.smartcampus.backend.dto.AuthSigninRequest;
import com.smartcampus.backend.dto.AuthSignupRequest;
import com.smartcampus.backend.dto.AuthProfileResponse;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.Role;
import com.smartcampus.backend.service.AuthService;

import jakarta.validation.Valid;

@Validated
@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;
    @Value("${app.oauth.google.client-id:}")
    private String googleClientId;
    @Value("${app.oauth.google.client-secret:}")
    private String googleClientSecret;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public AuthResponse signup(@Valid @RequestBody AuthSignupRequest request) {
        return authService.signup(request);
    }

    @PostMapping("/signin")
    public AuthResponse signin(@Valid @RequestBody AuthSigninRequest request) {
        return authService.signin(request);
    }

    @GetMapping("/google/enabled")
    public Map<String, Boolean> googleEnabled() {
        boolean enabled = googleClientId != null
                && !googleClientId.isBlank()
                && googleClientSecret != null
                && !googleClientSecret.isBlank();
        return Map.of("enabled", enabled);
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public AuthProfileResponse me(Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        return AuthProfileResponse.from(user);
    }

    @GetMapping("/roles")
    public List<Role> roles() {
        return List.of(Role.USER, Role.ADMIN);
    }
}
