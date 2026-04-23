package com.smartcampus.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.enums.BookingStatus;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByResourceNameAndBookingDateAndStatusIn(
            String resourceName,
            LocalDate bookingDate,
            List<BookingStatus> statuses
    );

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByResourceNameContainingIgnoreCase(String resourceName);

    List<Booking> findByBookingDate(LocalDate bookingDate);

    List<Booking> findByUserEmail(String userEmail);

    List<Booking> findByUserEmailAndBookingDateGreaterThanEqualOrderByBookingDateAscStartTimeAsc(
        String userEmail,
        LocalDate bookingDate
);

    long countByStatus(BookingStatus status);

    long countByUserEmail(String userEmail);

    long countByUserEmailAndStatus(String userEmail, BookingStatus status);



    @Query("SELECT b.resourceName, COUNT(b) FROM Booking b GROUP BY b.resourceName ORDER BY COUNT(b) DESC")
    List<Object[]> countBookingsByResource();

    @Query("""
        SELECT b FROM Booking b
        WHERE (:userEmail IS NULL OR b.userEmail = :userEmail)
        AND (:status IS NULL OR b.status = :status)
        AND (:bookingDate IS NULL OR b.bookingDate = :bookingDate)
        AND (:resourceName IS NULL OR LOWER(b.resourceName) LIKE LOWER(CONCAT('%', :resourceName, '%')))
    """)
    List<Booking> filterBookings(
            @Param("userEmail") String userEmail,
            @Param("status") BookingStatus status,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("resourceName") String resourceName
    );
}