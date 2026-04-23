package com.smartcampus.backend.dto;

import java.time.LocalDateTime;

import com.smartcampus.backend.entity.Notification;
import com.smartcampus.backend.enums.NotificationType;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private boolean read;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;

    public static NotificationResponse from(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getType(),
                notification.isRead(),
                notification.getCreatedAt(),
                notification.getReadAt());
    }
}
