package com.smartcampus.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.smartcampus.backend.entity.Ticket;
import com.smartcampus.backend.entity.TicketHistory;
import com.smartcampus.backend.enums.TicketPriority;
import com.smartcampus.backend.enums.TicketStatus;
import com.smartcampus.backend.service.TicketService;


@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket);
    }

    @PostMapping("/with-attachment")
    public Ticket createTicketWithAttachment(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String resourceName,
            @RequestParam String createdByEmail,
            @RequestParam TicketPriority priority,
            @RequestParam(required = false) MultipartFile attachment
    ) throws Exception {
        return ticketService.createTicketWithAttachment(
                title,
                description,
                resourceName,
                createdByEmail,
                priority,
                attachment
        );
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/creator")
    public List<Ticket> getTicketsByCreator(@RequestParam String email) {
        return ticketService.getTicketsByCreator(email);
    }

    @GetMapping("/technician")
    public List<Ticket> getTicketsByTechnician(@RequestParam String email) {
        return ticketService.getTicketsByTechnician(email);
    }

    @PutMapping("/{id}/assign")
    public Ticket assignTechnician(
            @PathVariable Long id,
            @RequestParam String technicianEmail,
            @RequestParam(required = false) String adminNote
    ) {
        return ticketService.assignTechnician(id, technicianEmail, adminNote);
    }

    @PutMapping("/{id}/status")
    public Ticket updateTicketStatus(
            @PathVariable Long id,
            @RequestParam TicketStatus status,
            @RequestParam(required = false) String technicianNote
    ) {
        return ticketService.updateTicketStatus(id, status, technicianNote);
    }

    @GetMapping("/{id}/history")
     public List<TicketHistory> getTicketHistory(@PathVariable Long id) {
        return ticketService.getTicketHistory(id);
}
}