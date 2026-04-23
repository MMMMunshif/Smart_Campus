package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Booking;
import com.smartcampus.backend.entity.Resource;
import com.smartcampus.backend.entity.Ticket;
import com.smartcampus.backend.repository.BookingRepository;
import com.smartcampus.backend.repository.ResourceRepository;
import com.smartcampus.backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/admin/reports")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminReportController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    @GetMapping("/bookings")
    public ResponseEntity<byte[]> exportBookingsReport() {
        List<Booking> bookings = bookingRepository.findAll();

        StringBuilder csv = new StringBuilder();
        csv.append("ID,User Name,User Email,Resource Name,Booking Date,Start Time,End Time,Purpose,Expected Attendees,Status,Admin Note\n");

        for (Booking booking : bookings) {
            csv.append(safe(booking.getId()))
                    .append(",")
                    .append(safe(booking.getUserName()))
                    .append(",")
                    .append(safe(booking.getUserEmail()))
                    .append(",")
                    .append(safe(booking.getResourceName()))
                    .append(",")
                    .append(safe(booking.getBookingDate()))
                    .append(",")
                    .append(safe(booking.getStartTime()))
                    .append(",")
                    .append(safe(booking.getEndTime()))
                    .append(",")
                    .append(safe(booking.getPurpose()))
                    .append(",")
                    .append(safe(booking.getExpectedAttendees()))
                    .append(",")
                    .append(safe(booking.getStatus()))
                    .append(",")
                    .append(safe(booking.getAdminNote()))
                    .append("\n");
        }

        return buildCsvResponse(csv.toString(), "bookings-report.csv");
    }

    @GetMapping("/tickets")
    public ResponseEntity<byte[]> exportTicketsReport() {
        List<Ticket> tickets = ticketRepository.findAll();

        StringBuilder csv = new StringBuilder();
        csv.append("ID,Title,Description,Resource Name,Created By,Assigned Technician,Priority,Status,Admin Note,Technician Note,Created At,Updated At\n");

        for (Ticket ticket : tickets) {
            csv.append(safe(ticket.getId()))
                    .append(",")
                    .append(safe(ticket.getTitle()))
                    .append(",")
                    .append(safe(ticket.getDescription()))
                    .append(",")
                    .append(safe(ticket.getResourceName()))
                    .append(",")
                    .append(safe(ticket.getCreatedByEmail()))
                    .append(",")
                    .append(safe(ticket.getAssignedTechnicianEmail()))
                    .append(",")
                    .append(safe(ticket.getPriority()))
                    .append(",")
                    .append(safe(ticket.getStatus()))
                    .append(",")
                    .append(safe(ticket.getAdminNote()))
                    .append(",")
                    .append(safe(ticket.getTechnicianNote()))
                    .append(",")
                    .append(safe(ticket.getCreatedAt()))
                    .append(",")
                    .append(safe(ticket.getUpdatedAt()))
                    .append("\n");
        }

        return buildCsvResponse(csv.toString(), "tickets-report.csv");
    }

    @GetMapping("/resources")
    public ResponseEntity<byte[]> exportResourcesReport() {
        List<Resource> resources = resourceRepository.findAll();

        StringBuilder csv = new StringBuilder();
        csv.append("ID,Resource Name,Resource Type,Location,Capacity,Availability Status,Allowed User Type,Description\n");

        for (Resource resource : resources) {
            csv.append(safe(resource.getId()))
                    .append(",")
                    .append(safe(resource.getResourceName()))
                    .append(",")
                    .append(safe(resource.getResourceType()))
                    .append(",")
                    .append(safe(resource.getLocation()))
                    .append(",")
                    .append(safe(resource.getCapacity()))
                    .append(",")
                    .append(safe(resource.getAvailabilityStatus()))
                    .append(",")
                    .append(safe(resource.getAllowedUserType()))
                    .append(",")
                    .append(safe(resource.getDescription()))
                    .append("\n");
        }

        return buildCsvResponse(csv.toString(), "resources-report.csv");
    }

    private ResponseEntity<byte[]> buildCsvResponse(String csvContent, String fileName) {
        byte[] data = csvContent.getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(data);
    }

    private String safe(Object value) {
        if (value == null) {
            return "";
        }

        String text = String.valueOf(value).replace("\"", "\"\"");
        return "\"" + text + "\"";
    }
}