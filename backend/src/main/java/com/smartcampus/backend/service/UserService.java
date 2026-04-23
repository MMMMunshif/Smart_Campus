package com.smartcampus.backend.service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.smartcampus.backend.dto.CompleteProfileRequest;
import com.smartcampus.backend.dto.RegisterRequest;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.ApprovalStatus;
import com.smartcampus.backend.enums.Role;
import com.smartcampus.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setProfileCompleted(false);
        user.setRequestedRole(Role.USER);
        user.setApprovalStatus(ApprovalStatus.NONE);

        return userRepository.save(user);
    }

    public User completeProfile(String email, CompleteProfileRequest request, String profilePhotoPath) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (profilePhotoPath != null) {
            user.setProfilePhoto(profilePhotoPath);
        }

        user.setPhone(request.getPhone());
        user.setFaculty(request.getFaculty());
        user.setStudentOrStaffId(request.getStudentOrStaffId());
        user.setUserType(request.getUserType());
        user.setBio(request.getBio());
        user.setProfileCompleted(true);

        Role requestedRole = Role.USER;
        if (request.getRequestedRole() != null && !request.getRequestedRole().isBlank()) {
            requestedRole = Role.valueOf(request.getRequestedRole().toUpperCase());
        }

        user.setRequestedRole(requestedRole);

        if (requestedRole == Role.USER) {
            user.setApprovalStatus(ApprovalStatus.NONE);
        } else {
            user.setApprovalStatus(ApprovalStatus.PENDING);
        }

        return userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> getPendingRoleRequests() {
        return userRepository.findByApprovalStatus(ApprovalStatus.PENDING);
    }

    public User approveRoleRequest(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(user.getRequestedRole());
        user.setApprovalStatus(ApprovalStatus.APPROVED);

        return userRepository.save(user);
    }

    public User rejectRoleRequest(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRequestedRole(Role.USER);
        user.setApprovalStatus(ApprovalStatus.REJECTED);

        return userRepository.save(user);
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    public User updateProfile(
        String email,
        String phone,
        String faculty,
        String studentOrStaffId,
        String userType,
        String bio,
        MultipartFile profilePhoto
) throws IOException {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    user.setPhone(phone);
    user.setFaculty(faculty);
    user.setStudentOrStaffId(studentOrStaffId);
    user.setUserType(userType);
    user.setBio(bio);

    if (profilePhoto != null && !profilePhoto.isEmpty()) {
        String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String fileName = UUID.randomUUID() + "_" + profilePhoto.getOriginalFilename();
        File destination = new File(uploadDir, fileName);
        profilePhoto.transferTo(destination);

        user.setProfilePhoto("/uploads/" + fileName);
    }

    return userRepository.save(user);
}
}