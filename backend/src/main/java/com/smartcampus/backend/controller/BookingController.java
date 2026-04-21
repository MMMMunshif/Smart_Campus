package com.smartcampus.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.enums.BookingStatus;
import com.smartcampus.backend.service.BookingService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/status/{status}")
    public List<Booking> getBookingsByStatus(@PathVariable BookingStatus status) {
        return bookingService.getBookingsByStatus(status);
    }

    @GetMapping("/resource/{name}")
    public List<Booking> searchByResource(@PathVariable String name) {
        return bookingService.searchByResource(name);
    }

    @GetMapping("/date/{date}")
    public List<Booking> searchByDate(@PathVariable LocalDate date) {
        return bookingService.searchByDate(date);
    }

    @GetMapping("/page")
    public Page<Booking> getPagedBookings(
            @RequestParam int page,
            @RequestParam int size) {
        return bookingService.getPagedBookings(page, size);
    }

    @PutMapping("/{id}/approve")
    public Booking approveBooking(@PathVariable Long id) {
        return bookingService.approveBooking(id);
    }

    @PutMapping("/{id}/reject")
    public Booking rejectBooking(@PathVariable Long id, @RequestParam String note) {
        return bookingService.rejectBooking(id, note);
    }

    @PutMapping("/{id}/cancel")
    public Booking cancelBooking(@PathVariable Long id) {
        return bookingService.cancelBooking(id);
    }
}