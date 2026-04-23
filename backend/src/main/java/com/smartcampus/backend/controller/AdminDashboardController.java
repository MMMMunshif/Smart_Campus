package com.smartcampus.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.repository.ResourceRepository;
import com.smartcampus.backend.repository.TicketRepository;
import com.smartcampus.backend.repository.UserRepository;

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

        map.put("totalUsers", userRepository.count());
        map.put("totalResources", resourceRepository.count());
        map.put("totalBookings", bookingRepository.count());
        map.put("totalTickets", ticketRepository.count());

        map.put("pendingRoleRequests",
                userRepository.findAll()
                        .stream()
                        .filter(u -> u.getRequestedRole() != null
                                && u.getRequestedRole() != u.getRole())
                        .count()
        );

        map.put("latestUsers",
                userRepository.findAll().stream().limit(5).toList()
        );

        map.put("latestTickets",
                ticketRepository.findAll().stream().limit(5).toList()
        );

        map.put("latestBookings",
                bookingRepository.findAll().stream().limit(5).toList()
        );

        return map;
    }
}