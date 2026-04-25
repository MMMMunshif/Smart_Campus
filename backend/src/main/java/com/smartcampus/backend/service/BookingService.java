package com.smartcampus.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.smartcampus.backend.dto.AdminDashboardAnalyticsResponse;
import com.smartcampus.backend.dto.AnalyticsDataPoint;
import com.smartcampus.backend.dto.BookingDashboardStats;
import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.entity.Notification;
import com.smartcampus.backend.enums.BookingStatus;
import com.smartcampus.backend.enums.NotificationType;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.repository.NotificationRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    public BookingService(
            BookingRepository bookingRepository,
            NotificationRepository notificationRepository,
            NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.notificationRepository = notificationRepository;
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

    public AdminDashboardAnalyticsResponse getAdminAnalytics() {
    long totalResources = bookingRepository.countDistinctResources();
    long totalBookings = bookingRepository.count();
    long pendingBookings = bookingRepository.countByStatus(BookingStatus.PENDING);
    long totalTickets = notificationRepository.count();
    long resolvedTickets = notificationRepository.countByIsReadTrue();

    List<AnalyticsDataPoint> mostBookedResources = bookingRepository.findMostBookedResources(PageRequest.of(0, 5))
        .stream()
        .map(row -> new AnalyticsDataPoint(
            String.valueOf(row[0]),
            ((Number) row[1]).longValue()))
        .toList();

    LocalDate startDate = LocalDate.now().minusDays(13);
    Map<LocalDate, Long> trendCounts = new HashMap<>();
    for (Object[] row : bookingRepository.findBookingTrendFrom(startDate)) {
        trendCounts.put((LocalDate) row[0], ((Number) row[1]).longValue());
    }

    DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MM-dd");
    List<AnalyticsDataPoint> bookingTrends = startDate
        .datesUntil(LocalDate.now().plusDays(1))
        .map(day -> new AnalyticsDataPoint(dateFormatter.format(day), trendCounts.getOrDefault(day, 0L)))
        .toList();

    List<AnalyticsDataPoint> ticketStatusDistribution = List.of(
        new AnalyticsDataPoint("Open", notificationRepository.countByIsReadFalse()),
        new AnalyticsDataPoint("Resolved", resolvedTickets));

    DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
    List<AnalyticsDataPoint> peakBookingHours = bookingRepository.findPeakBookingHours(PageRequest.of(0, 6))
        .stream()
        .map(row -> {
            int hour = ((Number) row[0]).intValue();
            String label = LocalTime.of(hour, 0).format(timeFormatter);
            return new AnalyticsDataPoint(label, ((Number) row[1]).longValue());
        })
        .toList();

    List<String> usageInsights = buildUsageInsights(
        totalBookings,
        pendingBookings,
        totalTickets,
        resolvedTickets,
        mostBookedResources,
        peakBookingHours);

    return new AdminDashboardAnalyticsResponse(
        totalResources,
        totalBookings,
        pendingBookings,
        totalTickets,
        resolvedTickets,
        mostBookedResources,
        bookingTrends,
        ticketStatusDistribution,
        peakBookingHours,
        usageInsights);
    }

    public String exportBookingsReportCsv() {
    StringBuilder csv = new StringBuilder();
    csv.append("booking_id,resource,booking_date,start_time,end_time,user_name,user_email,status,purpose,remarks,admin_note,created_at,updated_at\n");

    List<Booking> bookings = bookingRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    for (Booking booking : bookings) {
        csv.append(booking.getId()).append(',')
            .append(csvValue(booking.getResourceName())).append(',')
            .append(csvValue(booking.getBookingDate())).append(',')
            .append(csvValue(booking.getStartTime())).append(',')
            .append(csvValue(booking.getEndTime())).append(',')
            .append(csvValue(booking.getUserName())).append(',')
            .append(csvValue(booking.getUserEmail())).append(',')
            .append(csvValue(booking.getStatus())).append(',')
            .append(csvValue(booking.getPurpose())).append(',')
            .append(csvValue(booking.getRemarks())).append(',')
            .append(csvValue(booking.getAdminNote())).append(',')
            .append(csvValue(booking.getCreatedAt())).append(',')
            .append(csvValue(booking.getUpdatedAt()))
            .append('\n');
    }

    return csv.toString();
    }

    public String exportIncidentsReportCsv() {
    StringBuilder csv = new StringBuilder();
    csv.append("ticket_id,type,title,message,user_email,status,created_at,read_at\n");

    List<Notification> notifications = notificationRepository.findAllByOrderByCreatedAtDesc();
    for (Notification notification : notifications) {
        csv.append(notification.getId()).append(',')
            .append(csvValue(notification.getType())).append(',')
            .append(csvValue(notification.getTitle())).append(',')
            .append(csvValue(notification.getMessage())).append(',')
            .append(csvValue(notification.getUserEmail())).append(',')
            .append(csvValue(notification.isRead() ? "RESOLVED" : "OPEN")).append(',')
            .append(csvValue(notification.getCreatedAt())).append(',')
            .append(csvValue(notification.getReadAt()))
            .append('\n');
    }

    return csv.toString();
    }

    private List<String> buildUsageInsights(
        long totalBookings,
        long pendingBookings,
        long totalTickets,
        long resolvedTickets,
        List<AnalyticsDataPoint> mostBookedResources,
        List<AnalyticsDataPoint> peakBookingHours) {
    long pendingRate = totalBookings == 0 ? 0 : Math.round((pendingBookings * 100.0) / totalBookings);
    long resolvedRate = totalTickets == 0 ? 0 : Math.round((resolvedTickets * 100.0) / totalTickets);

    String topResource = mostBookedResources.isEmpty()
        ? "No dominant resource yet"
        : mostBookedResources.get(0).getLabel() + " leads with " + mostBookedResources.get(0).getValue() + " bookings";
    String topHour = peakBookingHours.isEmpty()
        ? "No booking-hour hotspots yet"
        : "Peak demand starts around " + peakBookingHours.get(0).getLabel();

    return List.of(
        "Pending bookings are at " + pendingRate + "% of total volume.",
        "Ticket resolution rate is " + resolvedRate + "%.",
        topResource + ".",
        topHour + ".");
    }

    private String csvValue(Object value) {
    if (value == null) {
        return "";
    }

    String raw = String.valueOf(value).replace("\"", "\"\"");
    return "\"" + raw + "\"";
    }
}
