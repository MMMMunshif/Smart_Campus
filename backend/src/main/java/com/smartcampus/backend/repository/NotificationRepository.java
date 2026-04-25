package com.smartcampus.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartcampus.backend.entity.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserEmailOrderByCreatedAtDesc(String userEmail);

    List<Notification> findByUserEmailAndIsReadFalseOrderByCreatedAtDesc(String userEmail);

    long countByUserEmailAndIsReadFalse(String userEmail);

    long countByIsReadTrue();

    long countByIsReadFalse();

    List<Notification> findAllByOrderByCreatedAtDesc();

    Optional<Notification> findByIdAndUserEmail(Long id, String userEmail);
}
