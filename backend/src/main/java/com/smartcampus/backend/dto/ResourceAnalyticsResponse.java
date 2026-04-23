package com.smartcampus.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResourceAnalyticsResponse {
    private long totalResources;
    private long availableResources;
    private long unavailableResources;
    private long maintenanceResources;
    private List<ResourceUsageItem> mostBookedResources;
}