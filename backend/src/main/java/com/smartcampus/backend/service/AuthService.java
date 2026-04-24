package com.smartcampus.backend.service;

import java.util.Locale;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.smartcampus.backend.dto.AuthResponse;
import com.smartcampus.backend.dto.AuthSigninRequest;
import com.smartcampus.backend.dto.AuthSignupRequest;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.NotificationType;
import com.smartcampus.backend.enums.Role;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final NotificationService notificationService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            NotificationService notificationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.notificationService = notificationService;
    }

    public AuthResponse signup(AuthSignupRequest request) {
        Role role = normalizeRole(request.getRole());
        String normalizedEmail = normalizeEmail(request.getEmail());

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered.");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setUsername(generateUniqueUsername(request.getName(), normalizedEmail));
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        User savedUser = userRepository.save(user);
        notificationService.notifyUser(
                savedUser.getEmail(),
                "Account Created",
                "Welcome to Smart Campus. Your " + savedUser.getRole() + " account is ready.",
                NotificationType.SECURITY);
        return buildAuthResponse(savedUser);
    }

    public AuthResponse signin(AuthSigninRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        Role requestedRole = normalizeRole(request.getRole());

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials.");
        }

        if (user.getRole() != requestedRole) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Role mismatch for this account.");
        }

        notificationService.notifyUser(
                user.getEmail(),
                "New Sign-In",
                "You signed in to Smart Campus as " + user.getRole() + ".",
                NotificationType.SECURITY);
        return buildAuthResponse(user);
    }

    public AuthResponse signinWithGoogle(String email, String name, String profileImageUrl) {
        String normalizedEmail = normalizeEmail(email);
        User user = userRepository.findByEmail(normalizedEmail).orElse(null);

        if (user == null) {
            user = new User();
            user.setName((name == null || name.isBlank()) ? normalizedEmail : name.trim());
            user.setUsername(generateUniqueUsername(user.getName(), normalizedEmail));
            user.setEmail(normalizedEmail);
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setProfileImageUrl(normalizeProfileImageUrl(profileImageUrl));
            user.setRole(Role.USER);
            user = userRepository.save(user);
        } else {
            normalizeRole(user.getRole());
            if (user.getUsername() == null || user.getUsername().isBlank()) {
                user.setUsername(generateUniqueUsername(user.getName(), normalizedEmail));
            }
            if ((user.getName() == null || user.getName().isBlank()) && name != null && !name.isBlank()) {
                user.setName(name.trim());
            }
            if (profileImageUrl != null && !profileImageUrl.isBlank()) {
                user.setProfileImageUrl(normalizeProfileImageUrl(profileImageUrl));
            }
            user = userRepository.save(user);
        }

        notificationService.notifyUser(
                user.getEmail(),
                "Google Sign-In",
                "You signed in with Google as " + user.getRole() + ".",
                NotificationType.SECURITY);
        return buildAuthResponse(user);
    }

    public User getUserByEmail(String email) {
        String normalizedEmail = normalizeEmail(email);
        return userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User profile not found."));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private Role normalizeRole(Role role) {
        if (role != Role.USER && role != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only USER and ADMIN sign-ins are supported.");
        }
        return role;
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtService.generateToken(user);
        return new AuthResponse(
                token,
                "Bearer",
                user.getName(),
                user.getEmail(),
                user.getProfileImageUrl(),
                user.getRole());
    }

    private String generateUniqueUsername(String name, String email) {
        String base = (name == null || name.isBlank()) ? email : name;
        String normalized = base.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "");
        if (normalized.isBlank()) {
            normalized = "user";
        }
        if (normalized.length() > 20) {
            normalized = normalized.substring(0, 20);
        }

        String candidate = normalized;
        int guard = 0;
        while (userRepository.existsByUsername(candidate)) {
            String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 4);
            candidate = normalized + suffix;
            if (candidate.length() > 30) {
                candidate = candidate.substring(0, 30);
            }
            guard++;
            if (guard > 20) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to generate username.");
            }
        }
        return candidate;
    }

    private String normalizeProfileImageUrl(String url) {
        if (url == null) {
            return null;
        }

        String trimmed = url.trim();
        if (trimmed.isBlank()) {
            return null;
        }
        return trimmed;
    }
}
