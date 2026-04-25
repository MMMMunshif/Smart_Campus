package com.smartcampus.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Pageable;
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

    long countByStatus(BookingStatus status);

    long countByUserEmail(String userEmail);

    long countByUserEmailAndStatus(String userEmail, BookingStatus status);

        @Query("""
            select count(distinct b.resourceName)
            from Booking b
            where b.resourceName is not null and trim(b.resourceName) <> ''
            """)
        long countDistinctResources();

        @Query("""
            select b.resourceName, count(b)
            from Booking b
            where b.resourceName is not null and trim(b.resourceName) <> ''
            group by b.resourceName
            order by count(b) desc
            """)
        List<Object[]> findMostBookedResources(Pageable pageable);

        @Query("""
            select b.bookingDate, count(b)
            from Booking b
            where b.bookingDate >= :fromDate
            group by b.bookingDate
            order by b.bookingDate asc
            """)
        List<Object[]> findBookingTrendFrom(@Param("fromDate") LocalDate fromDate);

        @Query("""
            select hour(b.startTime), count(b)
            from Booking b
            where b.startTime is not null
            group by hour(b.startTime)
            order by count(b) desc
            """)
        List<Object[]> findPeakBookingHours(Pageable pageable);
}