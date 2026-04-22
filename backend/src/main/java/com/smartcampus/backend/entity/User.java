package com.smartcampus.backend.entity;

import com.smartcampus.backend.enums.ApprovalStatus;
import com.smartcampus.backend.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String profilePhoto;

    private String phone;

    private String faculty;

    private String studentOrStaffId;

    private String userType;

    @Column(length = 1000)
    private String bio;

    @Column(nullable = false)
    private Boolean profileCompleted = false;

    @Enumerated(EnumType.STRING)
    private Role requestedRole;

    @Enumerated(EnumType.STRING)
    private ApprovalStatus approvalStatus = ApprovalStatus.NONE;
}