package com.smartcampus.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.backend.entity.Resource;
import com.smartcampus.backend.service.ResourceService;
import com.smartcampus.backend.dto.ResourceAnalyticsResponse;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @PostMapping
    public Resource createResource(@RequestBody Resource resource) {
        return resourceService.createResource(resource);
    }

    @GetMapping
    public List<Resource> getAllResources() {
        return resourceService.getAllResources();
    }

    @GetMapping("/{id}")
    public Resource getResourceById(@PathVariable Long id) {
        return resourceService.getResourceById(id);
    }

    @PutMapping("/{id}")
    public Resource updateResource(@PathVariable Long id, @RequestBody Resource resource) {
        return resourceService.updateResource(id, resource);
    }

    @DeleteMapping("/{id}")
    public String deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return "Resource deleted successfully";
    }

    @GetMapping("/search/name")
    public List<Resource> searchByName(@RequestParam String value) {
        return resourceService.searchByName(value);
    }

    @GetMapping("/search/type")
    public List<Resource> searchByType(@RequestParam String value) {
        return resourceService.searchByType(value);
    }

    @GetMapping("/search/location")
    public List<Resource> searchByLocation(@RequestParam String value) {
        return resourceService.searchByLocation(value);
    }

    @GetMapping("/analytics")
public ResourceAnalyticsResponse getResourceAnalytics() {
    return resourceService.getResourceAnalytics();
}
}