package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.entity.Resource;
import com.smartcampus.backend.entity.Ticket;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.repository.ResourceRepository;
import com.smartcampus.backend.repository.TicketRepository;
import com.smartcampus.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminDashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @GetMapping("/dashboard-summary")
    public Map<String, Object> getSummary() {
        Map<String, Object> map = new HashMap<>();

        List<User> users = userRepository.findAll();
        List<Resource> resources = resourceRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();
        List<Ticket> tickets = ticketRepository.findAll();

        map.put("totalUsers", users.size());
        map.put("totalResources", resources.size());
        map.put("totalBookings", bookings.size());
        map.put("totalTickets", tickets.size());

        long pendingRoleRequests = users.stream()
                .filter(u -> u.getRequestedRole() != null && !u.getRequestedRole().equals(u.getRole()))
                .count();

        map.put("pendingRoleRequests", pendingRoleRequests);

        map.put("latestUsers", users.stream().limit(5).toList());
        map.put("latestTickets", tickets.stream().limit(5).toList());
        map.put("latestBookings", bookings.stream().limit(5).toList());

        map.put("bookingsByStatus", bookings.stream()
                .collect(Collectors.groupingBy(
                        b -> b.getStatus() != null ? String.valueOf(b.getStatus()) : "UNKNOWN",
                        Collectors.counting()
                )));

        map.put("ticketsByStatus", tickets.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getStatus() != null ? String.valueOf(t.getStatus()) : "UNKNOWN",
                        Collectors.counting()
                )));

        map.put("resourcesByType", resources.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getResourceType() != null ? String.valueOf(r.getResourceType()) : "UNKNOWN",
                        Collectors.counting()
                )));

        map.put("usersByRole", users.stream()
                .collect(Collectors.groupingBy(
                        u -> u.getRole() != null ? String.valueOf(u.getRole()) : "UNKNOWN",
                        Collectors.counting()
                )));

        return map;
    }
}