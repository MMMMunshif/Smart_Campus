package com.smartcampus.backend.dto;

import com.smartcampus.backend.enums.Role;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRoleUpdateRequest {
    @NotNull(message = "Role is required")
    private Role role;
}
