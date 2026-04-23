package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.Ticket;
import com.smartcampus.backend.enums.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByCreatedByEmail(String createdByEmail);
    List<Ticket> findByAssignedTechnicianEmail(String assignedTechnicianEmail);
    List<Ticket> findByStatus(TicketStatus status);
}