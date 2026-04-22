package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByApprovalStatus(ApprovalStatus approvalStatus);
}