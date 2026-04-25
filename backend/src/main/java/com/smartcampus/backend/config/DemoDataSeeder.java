package com.smartcampus.backend.config;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.entity.Notification;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.BookingStatus;
import com.smartcampus.backend.enums.NotificationType;
import com.smartcampus.backend.enums.Role;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.repository.NotificationRepository;
import com.smartcampus.backend.repository.UserRepository;

@Component
public class DemoDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataSeeder(
            UserRepository userRepository,
            BookingRepository bookingRepository,
            NotificationRepository notificationRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedUsers();
        seedBookings();
        seedNotifications();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) {
            return;
        }

        User admin = new User();
        admin.setName("Admin One");
        admin.setUsername("adminone");
        admin.setEmail("admin@smartcampus.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);

        User user = new User();
        user.setName("Student User");
        user.setUsername("studentuser");
        user.setEmail("user@smartcampus.com");
        user.setPassword(passwordEncoder.encode("user123"));
        user.setRole(Role.USER);

        User tech = new User();
        tech.setName("Tech Staff");
        tech.setUsername("techstaff");
        tech.setEmail("tech@smartcampus.com");
        tech.setPassword(passwordEncoder.encode("tech123"));
        tech.setRole(Role.TECHNICIAN);

        userRepository.saveAll(List.of(admin, user, tech));
    }

    private void seedBookings() {
        if (bookingRepository.count() > 0) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();

        Booking b1 = new Booking();
        b1.setUserName("Student User");
        b1.setUserEmail("user@smartcampus.com");
        b1.setResourceName("Library Room A");
        b1.setBookingDate(LocalDate.now().plusDays(1));
        b1.setStartTime(LocalTime.of(9, 0));
        b1.setEndTime(LocalTime.of(10, 30));
        b1.setPurpose("Group study session");
        b1.setExpectedAttendees(6);
        b1.setStatus(BookingStatus.PENDING);
        b1.setRemarks("Need projector");
        b1.setCreatedAt(now.minusDays(2));
        b1.setUpdatedAt(now.minusDays(2));

        Booking b2 = new Booking();
        b2.setUserName("Admin One");
        b2.setUserEmail("admin@smartcampus.com");
        b2.setResourceName("Conference Hall 1");
        b2.setBookingDate(LocalDate.now().plusDays(2));
        b2.setStartTime(LocalTime.of(14, 0));
        b2.setEndTime(LocalTime.of(16, 0));
        b2.setPurpose("Faculty planning meeting");
        b2.setExpectedAttendees(20);
        b2.setStatus(BookingStatus.APPROVED);
        b2.setRemarks("Microphones required");
        b2.setCreatedAt(now.minusDays(4));
        b2.setUpdatedAt(now.minusDays(3));

        Booking b3 = new Booking();
        b3.setUserName("Student User");
        b3.setUserEmail("user@smartcampus.com");
        b3.setResourceName("Computer Lab B");
        b3.setBookingDate(LocalDate.now().minusDays(1));
        b3.setStartTime(LocalTime.of(11, 0));
        b3.setEndTime(LocalTime.of(12, 0));
        b3.setPurpose("Coding workshop");
        b3.setExpectedAttendees(12);
        b3.setStatus(BookingStatus.REJECTED);
        b3.setAdminNote("Lab maintenance at requested time");
        b3.setCreatedAt(now.minusDays(6));
        b3.setUpdatedAt(now.minusDays(5));

        Booking b4 = new Booking();
        b4.setUserName("Admin One");
        b4.setUserEmail("admin@smartcampus.com");
        b4.setResourceName("Seminar Room C");
        b4.setBookingDate(LocalDate.now().minusDays(3));
        b4.setStartTime(LocalTime.of(15, 0));
        b4.setEndTime(LocalTime.of(17, 0));
        b4.setPurpose("Orientation briefing");
        b4.setExpectedAttendees(30);
        b4.setStatus(BookingStatus.CANCELLED);
        b4.setRemarks("Event postponed");
        b4.setCreatedAt(now.minusDays(8));
        b4.setUpdatedAt(now.minusDays(2));

        bookingRepository.saveAll(List.of(b1, b2, b3, b4));
    }

    private void seedNotifications() {
        if (notificationRepository.count() > 0) {
            return;
        }

        Notification n1 = new Notification();
        n1.setUserEmail("admin@smartcampus.com");
        n1.setTitle("New Booking Request");
        n1.setMessage("Student User submitted a booking request for Library Room A.");
        n1.setType(NotificationType.BOOKING_CREATED);
        n1.setRead(false);

        Notification n2 = new Notification();
        n2.setUserEmail("user@smartcampus.com");
        n2.setTitle("Booking Approved");
        n2.setMessage("Your booking for Conference Hall 1 has been approved.");
        n2.setType(NotificationType.BOOKING_UPDATED);
        n2.setRead(true);
        n2.setReadAt(LocalDateTime.now().minusDays(1));

        Notification n3 = new Notification();
        n3.setUserEmail("tech@smartcampus.com");
        n3.setTitle("Role Updated");
        n3.setMessage("Your account role has been updated for maintenance duties.");
        n3.setType(NotificationType.ROLE_UPDATED);
        n3.setRead(false);

        Notification n4 = new Notification();
        n4.setUserEmail("admin@smartcampus.com");
        n4.setTitle("Security Notice");
        n4.setMessage("New sign-in detected from a trusted device.");
        n4.setType(NotificationType.SECURITY);
        n4.setRead(true);
        n4.setReadAt(LocalDateTime.now().minusHours(6));

        notificationRepository.saveAll(List.of(n1, n2, n3, n4));
    }
}
