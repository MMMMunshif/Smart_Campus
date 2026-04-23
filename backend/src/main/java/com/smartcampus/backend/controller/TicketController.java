package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Ticket;
import com.smartcampus.backend.enums.TicketStatus;
import com.smartcampus.backend.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}