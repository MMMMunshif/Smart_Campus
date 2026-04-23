package com.smartcampus.backend.controller;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.smartcampus.backend.dto.CompleteProfileRequest;
import com.smartcampus.backend.dto.RegisterRequest;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.Role;
import com.smartcampus.backend.service.UserService;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User registerUser(@RequestBody RegisterRequest request) {
        return userService.registerUser(request);
    }

    @PutMapping("/complete-profile")
    public User completeProfile(
            @RequestParam String email,
            @RequestParam String phone,
            @RequestParam String faculty,
            @RequestParam String studentOrStaffId,
            @RequestParam String userType,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) String requestedRole,
            @RequestParam(required = false) MultipartFile profilePhoto
    ) throws IOException {

        String profilePhotoPath = null;

        if (profilePhoto != null && !profilePhoto.isEmpty()) {
            String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";
            File uploadFolder = new File(uploadDir);

            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs();
            }

            String originalFilename = StringUtils.cleanPath(profilePhoto.getOriginalFilename());
            String fileExtension = "";

            int dotIndex = originalFilename.lastIndexOf(".");
            if (dotIndex >= 0) {
                fileExtension = originalFilename.substring(dotIndex);
            }

            String newFileName = UUID.randomUUID() + fileExtension;
            File destinationFile = new File(uploadFolder, newFileName);

            profilePhoto.transferTo(destinationFile);
            profilePhotoPath = "/uploads/" + newFileName;
        }

        CompleteProfileRequest request = new CompleteProfileRequest();
        request.setPhone(phone);
        request.setFaculty(faculty);
        request.setStudentOrStaffId(studentOrStaffId);
        request.setUserType(userType);
        request.setBio(bio);
        request.setRequestedRole(requestedRole);

        return userService.completeProfile(email, request, profilePhotoPath);
    }

    @GetMapping("/profile")
    public User getProfile(@RequestParam String email) {
        return userService.getUserByEmail(email);
    }

    @GetMapping("/pending-role-requests")
    public List<User> getPendingRoleRequests() {
        return userService.getPendingRoleRequests();
    }

    @PutMapping("/{id}/approve-role")
    public User approveRoleRequest(@PathVariable Long id) {
        return userService.approveRoleRequest(id);
    }

    @PutMapping("/{id}/reject-role")
    public User rejectRoleRequest(@PathVariable Long id) {
        return userService.rejectRoleRequest(id);
    }

    @GetMapping("/by-role")
public List<User> getUsersByRole(@RequestParam Role role) {
    return userService.getUsersByRole(role);
}

@PutMapping("/update-profile")
public User updateProfile(
        @RequestParam String email,
        @RequestParam(required = false) String phone,
        @RequestParam(required = false) String faculty,
        @RequestParam(required = false) String studentOrStaffId,
        @RequestParam(required = false) String userType,
        @RequestParam(required = false) String bio,
        @RequestParam(required = false) MultipartFile profilePhoto
) throws IOException {
    return userService.updateProfile(email, phone, faculty, studentOrStaffId, userType, bio, profilePhoto);
}

}