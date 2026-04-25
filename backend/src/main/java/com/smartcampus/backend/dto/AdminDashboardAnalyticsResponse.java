package com.smartcampus.backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardAnalyticsResponse {
    private long totalResources;
    private long totalBookings;
    private long pendingBookings;
    private long totalTickets;
    private long resolvedTickets;
    private List<AnalyticsDataPoint> mostBookedResources;
    private List<AnalyticsDataPoint> bookingTrends;
    private List<AnalyticsDataPoint> ticketStatusDistribution;
    private List<AnalyticsDataPoint> peakBookingHours;
    private List<String> usageInsights;
}
