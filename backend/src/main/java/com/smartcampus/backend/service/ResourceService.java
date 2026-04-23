package com.smartcampus.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcampus.backend.entity.Resource;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.repository.ResourceRepository;

import com.smartcampus.backend.dto.ResourceAnalyticsResponse;
import com.smartcampus.backend.dto.ResourceUsageItem;
import java.util.ArrayList;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
    }

    public Resource updateResource(Long id, Resource updatedResource) {
        Resource existing = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        existing.setResourceName(updatedResource.getResourceName());
        existing.setResourceType(updatedResource.getResourceType());
        existing.setLocation(updatedResource.getLocation());
        existing.setCapacity(updatedResource.getCapacity());
        existing.setAvailabilityStatus(updatedResource.getAvailabilityStatus());
        existing.setAllowedUserType(updatedResource.getAllowedUserType());
        existing.setDescription(updatedResource.getDescription());

        return resourceRepository.save(existing);
    }

    public void deleteResource(Long id) {
        Resource existing = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        resourceRepository.delete(existing);
    }

    public List<Resource> searchByName(String name) {
        return resourceRepository.findByResourceNameContainingIgnoreCase(name);
    }

    public List<Resource> searchByType(String type) {
        return resourceRepository.findByResourceTypeContainingIgnoreCase(type);
    }

    public List<Resource> searchByLocation(String location) {
        return resourceRepository.findByLocationContainingIgnoreCase(location);
    }

    @Autowired
private BookingRepository bookingRepository;

public ResourceAnalyticsResponse getResourceAnalytics() {
    long totalResources = resourceRepository.count();
    long availableResources = resourceRepository.countByAvailabilityStatus("AVAILABLE");
    long unavailableResources = resourceRepository.countByAvailabilityStatus("UNAVAILABLE");
    long maintenanceResources = resourceRepository.countByAvailabilityStatus("MAINTENANCE");

    List<Object[]> rows = bookingRepository.countBookingsByResource();
    List<ResourceUsageItem> mostBookedResources = new ArrayList<>();

    for (int i = 0; i < Math.min(rows.size(), 5); i++) {
        Object[] row = rows.get(i);
        String resourceName = (String) row[0];
        long bookingCount = (Long) row[1];
        mostBookedResources.add(new ResourceUsageItem(resourceName, bookingCount));
    }

    return new ResourceAnalyticsResponse(
            totalResources,
            availableResources,
            unavailableResources,
            maintenanceResources,
            mostBookedResources
    );
}


}