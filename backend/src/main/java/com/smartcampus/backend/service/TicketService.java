package com.smartcampus.backend.service;

import java.io.File;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.smartcampus.backend.entity.Ticket;
import com.smartcampus.backend.entity.TicketHistory;
import com.smartcampus.backend.enums.TicketPriority;
import com.smartcampus.backend.enums.TicketStatus;
import com.smartcampus.backend.repository.TicketHistoryRepository;
import com.smartcampus.backend.repository.TicketRepository;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private TicketHistoryRepository ticketHistoryRepository;

    public Ticket createTicket(Ticket ticket) {
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket savedTicket = ticketRepository.save(ticket);

        addHistory(
                savedTicket.getId(),
                "CREATED",
                "Ticket created for resource " + savedTicket.getResourceName(),
                savedTicket.getCreatedByEmail()
        );

        notificationService.createAdminNotification(
                "New Ticket Created",
                "A new ticket was created for resource " + ticket.getResourceName()
                        + " with priority " + ticket.getPriority() + "."
        );

        return savedTicket;
    }

    public Ticket createTicketWithAttachment(
            String title,
            String description,
            String resourceName,
            String createdByEmail,
            TicketPriority priority,
            MultipartFile attachment
    ) throws Exception {

        Ticket ticket = new Ticket();
        ticket.setTitle(title);
        ticket.setDescription(description);
        ticket.setResourceName(resourceName);
        ticket.setCreatedByEmail(createdByEmail);
        ticket.setPriority(priority);
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        if (attachment != null && !attachment.isEmpty()) {
            String uploadDir = System.getProperty("user.dir") + File.separator + "uploads";
            File dir = new File(uploadDir);

            if (!dir.exists()) {
                dir.mkdirs();
            }

            String originalFileName = attachment.getOriginalFilename();
            String fileName = UUID.randomUUID() + "_" + originalFileName;

            File destination = new File(uploadDir, fileName);
            attachment.transferTo(destination);

            ticket.setAttachmentName(originalFileName);
            ticket.setAttachmentUrl("/uploads/" + fileName);
        }

        Ticket savedTicket = ticketRepository.save(ticket);

        addHistory(
                savedTicket.getId(),
                "CREATED",
                "Ticket created for resource " + savedTicket.getResourceName(),
                savedTicket.getCreatedByEmail()
        );

        if (savedTicket.getAttachmentUrl() != null) {
            addHistory(
                    savedTicket.getId(),
                    "ATTACHMENT_ADDED",
                    "Attachment uploaded: " + savedTicket.getAttachmentName(),
                    savedTicket.getCreatedByEmail()
            );
        }

        notificationService.createAdminNotification(
                "New Ticket Created",
                "A new ticket was created for resource " + ticket.getResourceName()
                        + " with priority " + ticket.getPriority() + "."
        );

        return savedTicket;
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getTicketsByCreator(String email) {
        return ticketRepository.findByCreatedByEmail(email);
    }

    public List<Ticket> getTicketsByTechnician(String email) {
        return ticketRepository.findByAssignedTechnicianEmail(email);
    }

    public Ticket assignTechnician(Long id, String technicianEmail, String adminNote) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setAssignedTechnicianEmail(technicianEmail);
        ticket.setAdminNote(adminNote);
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket updatedTicket = ticketRepository.save(ticket);

        addHistory(
                updatedTicket.getId(),
                "ASSIGNED",
                "Ticket assigned to technician " + technicianEmail,
                "ADMIN"
        );

        addHistory(
                updatedTicket.getId(),
                "STATUS_UPDATED",
                "Status changed to IN_PROGRESS",
                "ADMIN"
        );

        if (adminNote != null && !adminNote.isBlank()) {
            addHistory(
                    updatedTicket.getId(),
                    "ADMIN_NOTE",
                    adminNote,
                    "ADMIN"
            );
        }

        notificationService.createNotification(
                technicianEmail,
                "New Ticket Assigned",
                "You have been assigned ticket '" + ticket.getTitle()
                        + "' for resource " + ticket.getResourceName() + "."
        );

        return updatedTicket;
    }

    public Ticket updateTicketStatus(Long id, TicketStatus status, String technicianNote) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus(status);
        ticket.setTechnicianNote(technicianNote);
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket updatedTicket = ticketRepository.save(ticket);

        addHistory(
                updatedTicket.getId(),
                "STATUS_UPDATED",
                "Status changed to " + status,
                updatedTicket.getAssignedTechnicianEmail()
        );

        if (technicianNote != null && !technicianNote.isBlank()) {
            addHistory(
                    updatedTicket.getId(),
                    "TECHNICIAN_NOTE",
                    technicianNote,
                    updatedTicket.getAssignedTechnicianEmail()
            );
        }

        notificationService.createNotification(
                ticket.getCreatedByEmail(),
                "Ticket Status Updated",
                "Your ticket '" + ticket.getTitle() + "' is now " + status + "."
        );

        return updatedTicket;
    }

    public List<TicketHistory> getTicketHistory(Long ticketId) {
        return ticketHistoryRepository.findByTicketIdOrderByCreatedAtAsc(ticketId);
    }

    private void addHistory(Long ticketId, String action, String message, String updatedBy) {
        TicketHistory history = new TicketHistory();
        history.setTicketId(ticketId);
        history.setAction(action);
        history.setMessage(message);
        history.setUpdatedBy(updatedBy);
        history.setCreatedAt(LocalDateTime.now());

        ticketHistoryRepository.save(history);
    }
}