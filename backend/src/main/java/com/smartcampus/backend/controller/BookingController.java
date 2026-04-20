package com.smartcampus.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.service.BookingService;

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
    public java.util.List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PutMapping("/{id}/approve")
public Booking approveBooking(@PathVariable Long id) {
    return bookingService.approveBooking(id);
}

@PutMapping("/{id}/reject")
public Booking rejectBooking(@PathVariable Long id) {
    return bookingService.rejectBooking(id);
}

@PutMapping("/{id}/cancel")
public Booking cancelBooking(@PathVariable Long id) {
    return bookingService.cancelBooking(id);
}
}