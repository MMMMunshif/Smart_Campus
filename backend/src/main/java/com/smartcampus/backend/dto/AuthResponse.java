package com.smartcampus.backend.dto;

import com.smartcampus.backend.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String tokenType;
    private String name;
    private String email;
    private String profileImageUrl;
    private Role role;
}
