package com.smartcampus.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.smartcampus.backend.dto.NotificationResponse;
import com.smartcampus.backend.entity.Notification;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.NotificationType;
import com.smartcampus.backend.enums.Role;
import com.smartcampus.backend.repository.NotificationRepository;
import com.smartcampus.backend.repository.UserRepository;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public void notifyUser(String userEmail, String title, String message, NotificationType type) {
        if (userEmail == null || userEmail.isBlank()) {
            return;
        }
        Notification notification = new Notification();
        notification.setUserEmail(normalizeEmail(userEmail));
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false);
        notificationRepository.save(notification);
    }

    public void notifyAdmins(String title, String message, NotificationType type) {
        List<User> admins = userRepository.findByRole(Role.ADMIN);
        for (User admin : admins) {
            notifyUser(admin.getEmail(), title, message, type);
        }
    }

    public List<NotificationResponse> getNotificationsFor(String userEmail, boolean unreadOnly) {
        String normalizedEmail = normalizeEmail(userEmail);
        List<Notification> notifications = unreadOnly
                ? notificationRepository.findByUserEmailAndIsReadFalseOrderByCreatedAtDesc(normalizedEmail)
                : notificationRepository.findByUserEmailOrderByCreatedAtDesc(normalizedEmail);
        return notifications.stream().map(NotificationResponse::from).toList();
    }

    public long getUnreadCount(String userEmail) {
        return notificationRepository.countByUserEmailAndIsReadFalse(normalizeEmail(userEmail));
    }

    @Transactional
    public NotificationResponse markAsRead(Long notificationId, String userEmail) {
        Notification notification = notificationRepository
                .findByIdAndUserEmail(notificationId, normalizeEmail(userEmail))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found."));

        if (!notification.isRead()) {
            notification.setRead(true);
            notification.setReadAt(LocalDateTime.now());
            notification = notificationRepository.save(notification);
        }

        return NotificationResponse.from(notification);
    }

    @Transactional
    public int markAllAsRead(String userEmail) {
        String normalizedEmail = normalizeEmail(userEmail);
        List<Notification> unread = notificationRepository.findByUserEmailAndIsReadFalseOrderByCreatedAtDesc(normalizedEmail);
        if (unread.isEmpty()) {
            return 0;
        }

        LocalDateTime now = LocalDateTime.now();
        for (Notification notification : unread) {
            notification.setRead(true);
            notification.setReadAt(now);
        }
        notificationRepository.saveAll(unread);
        return unread.size();
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
