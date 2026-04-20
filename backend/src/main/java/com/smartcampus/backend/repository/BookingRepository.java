package com.smartcampus.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
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
}