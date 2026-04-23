package com.smartcampus.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompleteProfileRequest {
    private String phone;
    private String faculty;
    private String studentOrStaffId;
    private String userType;
    private String bio;
    private String requestedRole;
}