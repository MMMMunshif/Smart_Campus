package com.smartcampus.backend.dto;

import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthProfileResponse {
    private String name;
    private String email;
    private String username;
    private String profileImageUrl;
    private Role role;

    public static AuthProfileResponse from(User user) {
        return new AuthProfileResponse(
                user.getName(),
                user.getEmail(),
                user.getUsername(),
                user.getProfileImageUrl(),
                user.getRole());
    }
}
