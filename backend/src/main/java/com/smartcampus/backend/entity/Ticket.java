package com.smartcampus.backend.entity;

import com.smartcampus.backend.enums.TicketPriority;
import com.smartcampus.backend.enums.TicketStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 2000)
    private String description;

    private String resourceName;

    private String createdByEmail;

    private String assignedTechnicianEmail;

    @Enumerated(EnumType.STRING)
    private TicketPriority priority;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    @Column(length = 1000)
    private String adminNote;

    @Column(length = 1000)
    private String technicianNote;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}