package com.smartcampus.backend.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.backend.dto.UserRoleUpdateRequest;
import com.smartcampus.backend.dto.UserSummaryResponse;
import com.smartcampus.backend.service.UserManagementService;

import jakarta.validation.Valid;

@Validated
@RestController
@CrossOrigin
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserManagementService userManagementService;

    public AdminUserController(UserManagementService userManagementService) {
        this.userManagementService = userManagementService;
    }

    @GetMapping
    public List<UserSummaryResponse> listUsers() {
        return userManagementService.listUsers();
    }

    @PutMapping("/{id}/role")
    public UserSummaryResponse updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UserRoleUpdateRequest request,
            Authentication authentication) {
        return userManagementService.updateUserRole(id, request.getRole(), authentication.getName());
    }
}
