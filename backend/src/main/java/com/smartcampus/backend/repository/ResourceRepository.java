package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByResourceNameContainingIgnoreCase(String resourceName);
    List<Resource> findByResourceTypeContainingIgnoreCase(String resourceType);
    List<Resource> findByLocationContainingIgnoreCase(String location);
    Optional<Resource> findByResourceName(String resourceName);

    long countByAvailabilityStatus(String availabilityStatus);
}