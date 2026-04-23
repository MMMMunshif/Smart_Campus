package com.smartcampus.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.smartcampus.backend.dto.BookingDashboardStats;
import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.entity.Resource;
import com.smartcampus.backend.enums.BookingStatus;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.repository.ResourceRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ResourceRepository resourceRepository;

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
        throw new RuntimeException(
                "Booking conflict: " + booking.getResourceName()
                        + " is already booked on " + booking.getBookingDate()
                        + " from " + existing.getStartTime()
                        + " to " + existing.getEndTime()
                        + ". Please choose a different time slot."
        );
    }
}

        Resource resource = resourceRepository.findByResourceName(booking.getResourceName())
                .orElseThrow(() -> new RuntimeException("Selected resource not found."));

        if (booking.getExpectedAttendees() > resource.getCapacity()) {
            throw new RuntimeException(
                    "Booking failed: Expected attendees exceed the resource capacity of " + resource.getCapacity() + "."
            );
        }

        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);

        notificationService.createNotification(
                booking.getUserEmail(),
                "Booking Submitted",
                "Your booking request for " + booking.getResourceName() + " on " +
                        booking.getBookingDate() + " has been submitted and is pending review."
        );

        return savedBooking;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getBookingsByUserEmail(String userEmail) {
        return bookingRepository.findByUserEmail(userEmail);
    }

    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    public List<Booking> searchByResource(String resourceName) {
        return bookingRepository.findByResourceNameContainingIgnoreCase(resourceName);
    }

    public List<Booking> searchByDate(LocalDate bookingDate) {
        return bookingRepository.findByBookingDate(bookingDate);
    }

    public Page<Booking> getPagedBookings(int page, int size) {
        return bookingRepository.findAll(PageRequest.of(page, size));
    }

    public Booking approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only PENDING bookings can be approved.");
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setUpdatedAt(LocalDateTime.now());

        notificationService.createNotification(
                booking.getUserEmail(),
                "Booking Approved",
                "Your booking for " + booking.getResourceName() + " on " +
                        booking.getBookingDate() + " has been approved."
        );

        return bookingRepository.save(booking);
    }

    public Booking rejectBooking(Long id, String note) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only PENDING bookings can be rejected.");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setAdminNote(note);
        booking.setUpdatedAt(LocalDateTime.now());

        notificationService.createNotification(
                booking.getUserEmail(),
                "Booking Rejected",
                "Your booking for " + booking.getResourceName() + " on " +
                        booking.getBookingDate() + " was rejected. Reason: " + note
        );

        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new RuntimeException("Only APPROVED bookings can be cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());

        notificationService.createNotification(
                booking.getUserEmail(),
                "Booking Cancelled",
                "Your booking for " + booking.getResourceName() + " on " +
                        booking.getBookingDate() + " has been cancelled."
        );

        return bookingRepository.save(booking);
    }

    public BookingDashboardStats getAdminDashboardStats() {
        long total = bookingRepository.count();
        long pending = bookingRepository.countByStatus(BookingStatus.PENDING);
        long approved = bookingRepository.countByStatus(BookingStatus.APPROVED);
        long rejected = bookingRepository.countByStatus(BookingStatus.REJECTED);
        long cancelled = bookingRepository.countByStatus(BookingStatus.CANCELLED);

        return new BookingDashboardStats(total, pending, approved, rejected, cancelled);
    }

    public BookingDashboardStats getUserDashboardStats(String userEmail) {
        long total = bookingRepository.countByUserEmail(userEmail);
        long pending = bookingRepository.countByUserEmailAndStatus(userEmail, BookingStatus.PENDING);
        long approved = bookingRepository.countByUserEmailAndStatus(userEmail, BookingStatus.APPROVED);
        long rejected = bookingRepository.countByUserEmailAndStatus(userEmail, BookingStatus.REJECTED);
        long cancelled = bookingRepository.countByUserEmailAndStatus(userEmail, BookingStatus.CANCELLED);

        return new BookingDashboardStats(total, pending, approved, rejected, cancelled);
    }

    public List<Booking> getUpcomingBookings(String userEmail) {
    return bookingRepository
            .findByUserEmailAndBookingDateGreaterThanEqualOrderByBookingDateAscStartTimeAsc(
                    userEmail,
                    LocalDate.now()
            )
            .stream()
            .limit(3)
            .toList();
}
}