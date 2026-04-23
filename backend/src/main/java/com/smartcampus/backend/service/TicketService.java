package com.smartcampus.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcampus.backend.entity.Ticket;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.enums.Role;
import com.smartcampus.backend.enums.TicketStatus;
import com.smartcampus.backend.repository.TicketRepository;
import com.smartcampus.backend.repository.UserRepository;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    public Ticket createTicket(Ticket ticket) {
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket savedTicket = ticketRepository.save(ticket);

        List<User> admins = userRepository.findByRole(Role.ADMIN);
        for (User admin : admins) {
            notificationService.createNotification(
                    admin.getEmail(),
                    "New Ticket Created",
                    "A new ticket was created for resource " + ticket.getResourceName()
                            + " with priority " + ticket.getPriority() + "."
            );
        }

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

        notificationService.createNotification(
                ticket.getCreatedByEmail(),
                "Ticket Status Updated",
                "Your ticket '" + ticket.getTitle() + "' is now " + status + "."
        );

        return updatedTicket;
    }
}