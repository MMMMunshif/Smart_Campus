package com.smartcampus.backend.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.backend.dto.LoginRequest;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        HttpSession session = httpRequest.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

        Optional<User> user = userRepository.findByEmail(request.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", authentication.isAuthenticated());
        response.put("name", user.map(User::getName).orElse(""));
        response.put("email", request.getEmail());
        response.put("profileCompleted", user.map(User::getProfileCompleted).orElse(false));
        response.put("role", user.map(u -> u.getRole().name()).orElse("USER"));
        response.put("requestedRole", user.map(u -> u.getRequestedRole() != null ? u.getRequestedRole().name() : "USER").orElse("USER"));
        response.put("approvalStatus", user.map(u -> u.getApprovalStatus() != null ? u.getApprovalStatus().name() : "NONE").orElse("NONE"));
        response.put("profilePhoto", user.map(User::getProfilePhoto).orElse(""));
        response.put("userType", user.map(User::getUserType).orElse(""));

        return response;
    }

    @GetMapping("/me")
    public Map<String, Object> currentUser(
            @AuthenticationPrincipal OAuth2User principal,
            Principal normalPrincipal
    ) {
        Map<String, Object> response = new HashMap<>();

        String email = null;
        String name = null;

        if (principal != null) {
            email = principal.getAttribute("email");
            name = principal.getAttribute("name");
        } else if (normalPrincipal != null) {
            email = normalPrincipal.getName();
        } else {
            response.put("authenticated", false);
            return response;
        }

        Optional<User> user = userRepository.findByEmail(email);

        response.put("authenticated", true);
        response.put("name", user.map(User::getName).orElse(name != null ? name : ""));
        response.put("email", email != null ? email : "");
        response.put("profileCompleted", user.map(User::getProfileCompleted).orElse(false));
        response.put("role", user.map(u -> u.getRole().name()).orElse("USER"));
        response.put("requestedRole", user.map(u -> u.getRequestedRole() != null ? u.getRequestedRole().name() : "USER").orElse("USER"));
        response.put("approvalStatus", user.map(u -> u.getApprovalStatus() != null ? u.getApprovalStatus().name() : "NONE").orElse("NONE"));
        response.put("profilePhoto", user.map(User::getProfilePhoto).orElse(""));
        response.put("userType", user.map(User::getUserType).orElse(""));

        return response;
    }

    @PostMapping("/logout-session")
    public Map<String, Object> logoutSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        SecurityContextHolder.clearContext();

        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", false);
        response.put("message", "Logged out successfully");

        return response;
    }
}