package com.smartcampus.backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.backend.dto.AdminDashboardAnalyticsResponse;
import com.smartcampus.backend.dto.BookingDashboardStats;
import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.enums.BookingStatus;
import com.smartcampus.backend.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public Booking createBooking(@RequestBody Booking booking, Authentication authentication) {
        if (authentication != null && hasRole(authentication, "ROLE_USER")) {
            booking.setUserEmail(authentication.getName());
        }
        return bookingService.createBooking(booking);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Booking> getBookingsByStatus(@PathVariable BookingStatus status) {
        return bookingService.getBookingsByStatus(status);
    }

    @GetMapping("/resource/{name}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Booking> searchByResource(@PathVariable String name) {
        return bookingService.searchByResource(name);
    }

    @GetMapping("/date/{date}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Booking> searchByDate(@PathVariable LocalDate date) {
        return bookingService.searchByDate(date);
    }

    @GetMapping("/page")
    @PreAuthorize("hasRole('ADMIN')")
    public Page<Booking> getPagedBookings(
            @RequestParam int page,
            @RequestParam int size) {
        return bookingService.getPagedBookings(page, size);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public Booking approveBooking(@PathVariable Long id) {
        return bookingService.approveBooking(id);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public Booking rejectBooking(@PathVariable Long id, @RequestParam String note) {
        return bookingService.rejectBooking(id, note);
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public Booking cancelBooking(@PathVariable Long id) {
        return bookingService.cancelBooking(id);
    }

    @GetMapping("/user")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public List<Booking> getBookingsByUserEmail(
            @RequestParam(required = false) String email,
            Authentication authentication) {
        return bookingService.getBookingsByUserEmail(resolveScopedEmail(email, authentication));
    }

    @GetMapping("/dashboard/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public BookingDashboardStats getAdminDashboardStats() {
        return bookingService.getAdminDashboardStats();
    }

    @GetMapping("/dashboard/admin/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public AdminDashboardAnalyticsResponse getAdminAnalytics() {
        return bookingService.getAdminAnalytics();
    }

    @GetMapping("/dashboard/admin/report/bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> exportBookingsReport() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bookings-report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bookingService.exportBookingsReportCsv());
    }

    @GetMapping("/dashboard/admin/report/incidents")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> exportIncidentsReport() {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=incidents-report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(bookingService.exportIncidentsReportCsv());
    }

    @GetMapping("/dashboard/user")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public BookingDashboardStats getUserDashboardStats(
            @RequestParam(required = false) String email,
            Authentication authentication) {
        return bookingService.getUserDashboardStats(resolveScopedEmail(email, authentication));
    }

    private String resolveScopedEmail(String requestedEmail, Authentication authentication) {
        if (requestedEmail != null && !requestedEmail.isBlank() && hasRole(authentication, "ROLE_ADMIN")) {
            return requestedEmail;
        }
        return authentication.getName();
    }

    private boolean hasRole(Authentication authentication, String role) {
        if (authentication == null || authentication.getAuthorities() == null) {
            return false;
        }

        return authentication.getAuthorities().stream()
                .anyMatch(authority -> role.equals(authority.getAuthority()));
    }
}
