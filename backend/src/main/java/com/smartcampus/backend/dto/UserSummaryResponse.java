package com.smartcampus.backend.dto;

import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserSummaryResponse {
    private Long id;
    private String name;
    private String username;
    private String email;
    private Role role;

    public static UserSummaryResponse from(User user) {
        return new UserSummaryResponse(
                user.getId(),
                user.getName(),
                user.getUsername(),
                user.getEmail(),
                user.getRole());
    }
}
