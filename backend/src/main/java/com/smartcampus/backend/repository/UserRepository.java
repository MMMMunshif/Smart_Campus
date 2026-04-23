package com.smartcampus.backend.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.Role;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    List<User> findAllByOrderByNameAsc();
    List<User> findByRole(Role role);
    long countByRole(Role role);
}
