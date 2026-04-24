package com.smartcampus.backend.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.smartcampus.backend.dto.UserSummaryResponse;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.NotificationType;
import com.smartcampus.backend.enums.Role;
import com.smartcampus.backend.repository.UserRepository;

@Service
public class UserManagementService {

    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public UserManagementService(UserRepository userRepository, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public List<UserSummaryResponse> listUsers() {
        return userRepository.findAllByOrderByNameAsc().stream()
                .map(UserSummaryResponse::from)
                .toList();
    }

    @Transactional
    public UserSummaryResponse updateUserRole(Long userId, Role newRole, String actingAdminEmail) {
        Role requestedRole = validateRole(newRole);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        Role currentRole = user.getRole();
        if (currentRole == requestedRole) {
            return UserSummaryResponse.from(user);
        }

        if (currentRole == Role.ADMIN && requestedRole != Role.ADMIN && userRepository.countByRole(Role.ADMIN) <= 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one ADMIN account is required.");
        }

        user.setRole(requestedRole);
        User saved = userRepository.save(user);

        String actor = (actingAdminEmail == null || actingAdminEmail.isBlank()) ? "An administrator" : actingAdminEmail;
        notificationService.notifyUser(
                saved.getEmail(),
                "Role Updated",
                "Your account role was changed from " + currentRole + " to " + requestedRole + " by " + actor + ".",
                NotificationType.ROLE_UPDATED);

        return UserSummaryResponse.from(saved);
    }

    private Role validateRole(Role role) {
        if (role != Role.USER && role != Role.ADMIN) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only USER and ADMIN roles are supported by this authentication module.");
        }
        return role;
    }
}
