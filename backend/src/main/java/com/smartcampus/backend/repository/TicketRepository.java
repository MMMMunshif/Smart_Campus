package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCreatedByUserId(Long userId);
    List<Ticket> findByAssignedToTechnicianId(Long techId);
}