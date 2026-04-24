package com.smartcampus.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.smartcampus.backend.dto.BookingDashboardStats;
import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.enums.BookingStatus;
import com.smartcampus.backend.enums.NotificationType;
import com.smartcampus.backend.repository.BookingRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    public BookingService(BookingRepository bookingRepository, NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
    }

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
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        Booking saved = bookingRepository.save(booking);
        notificationService.notifyUser(
                saved.getUserEmail(),
                "Booking Submitted",
                "Your request for " + saved.getResourceName() + " on " + saved.getBookingDate() + " is pending review.",
                NotificationType.BOOKING_CREATED);
        notificationService.notifyAdmins(
                "New Booking Request",
                saved.getUserName() + " submitted a booking for " + saved.getResourceName() + ".",
                NotificationType.BOOKING_CREATED);
        return saved;
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

        Booking saved = bookingRepository.save(booking);
        notificationService.notifyUser(
                saved.getUserEmail(),
                "Booking Approved",
                "Your booking for " + saved.getResourceName() + " on " + saved.getBookingDate() + " has been approved.",
                NotificationType.BOOKING_UPDATED);
        return saved;
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

        Booking saved = bookingRepository.save(booking);
        notificationService.notifyUser(
                saved.getUserEmail(),
                "Booking Rejected",
                "Your booking for " + saved.getResourceName() + " was rejected. Note: " + note,
                NotificationType.BOOKING_UPDATED);
        return saved;
    }

    public Booking cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new RuntimeException("Only APPROVED bookings can be cancelled.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());

        Booking saved = bookingRepository.save(booking);
        notificationService.notifyUser(
                saved.getUserEmail(),
                "Booking Cancelled",
                "Your booking for " + saved.getResourceName() + " on " + saved.getBookingDate() + " was cancelled.",
                NotificationType.BOOKING_UPDATED);
        return saved;
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
}
