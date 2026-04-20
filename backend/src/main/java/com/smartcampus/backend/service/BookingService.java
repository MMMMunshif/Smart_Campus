package com.smartcampus.backend.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.enums.BookingStatus;
import com.smartcampus.backend.repository.BookingRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking createBooking(Booking booking) {
        List<Booking> existingBookings = bookingRepository.findByResourceNameAndBookingDateAndStatusIn(
                booking.getResourceName(),
                booking.getBookingDate(),
                Arrays.asList(BookingStatus.PENDING, BookingStatus.APPROVED)
        );

        for (Booking existing : existingBookings) {
            boolean isConflict =
                    booking.getStartTime().isBefore(existing.getEndTime()) &&
                    booking.getEndTime().isAfter(existing.getStartTime());

            if (isConflict) {
                throw new RuntimeException("Booking conflict: This resource is already booked for the selected time.");
            }
        }

        booking.setStatus(BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

  public Booking approveBooking(Long id) {
    Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    if (booking.getStatus() != BookingStatus.PENDING) {
        throw new RuntimeException("Only PENDING bookings can be approved.");
    }

    booking.setStatus(BookingStatus.APPROVED);
    return bookingRepository.save(booking);
}

public Booking rejectBooking(Long id) {
    Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    if (booking.getStatus() != BookingStatus.PENDING) {
        throw new RuntimeException("Only PENDING bookings can be rejected.");
    }

    booking.setStatus(BookingStatus.REJECTED);
    return bookingRepository.save(booking);
}

public Booking cancelBooking(Long id) {
    Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

    if (booking.getStatus() != BookingStatus.APPROVED) {
        throw new RuntimeException("Only APPROVED bookings can be cancelled.");
    }

    booking.setStatus(BookingStatus.CANCELLED);
    return bookingRepository.save(booking);
}
}