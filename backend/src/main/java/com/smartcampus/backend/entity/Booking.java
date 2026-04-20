package com.smartcampus.backend.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import com.smartcampus.backend.enums.BookingStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userName;

    private String resourceName;

    private LocalDate bookingDate;

    private LocalTime startTime;

    private LocalTime endTime;

    private String purpose;

    private Integer expectedAttendees;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;
}