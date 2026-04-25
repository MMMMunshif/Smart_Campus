package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.TicketCommentRequest;
import com.smartcampus.backend.model.*;
import com.smartcampus.backend.repository.TicketAttachmentRepository;
import com.smartcampus.backend.repository.TicketCommentRepository;
import com.smartcampus.backend.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketAttachmentRepository attachmentRepository;
    private final TicketCommentRepository commentRepository;
    private final FileStorageService fileStorageService;

    public TicketService(TicketRepository ticketRepository,
                         TicketAttachmentRepository attachmentRepository,
                         TicketCommentRepository commentRepository,
                         FileStorageService fileStorageService) {
        this.ticketRepository = ticketRepository;
        this.attachmentRepository = attachmentRepository;
        this.commentRepository = commentRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public Ticket createTicket(String title,
                               String description,
                               TicketCategory category,
                               TicketPriority priority,
                               Long createdByUserId,
                               List<MultipartFile> files) throws Exception {

        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Ticket title is required");
        }
        if (description == null || description.trim().isEmpty()) {
            throw new IllegalArgumentException("Ticket description is required");
        }
        if (createdByUserId == null) {
            throw new IllegalArgumentException("Created by user id is required");
        }

        List<MultipartFile> validFiles = files == null ? List.of() : files.stream()
                .filter(file -> file != null && !file.isEmpty())
                .toList();

        if (validFiles.size() > 3) {
            throw new IllegalArgumentException("Maximum 3 image attachments allowed");
        }

        Ticket ticket = new Ticket();
        ticket.setTitle(title.trim());
        ticket.setDescription(description.trim());
        ticket.setCategory(category);
        ticket.setPriority(priority);
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedByUserId(createdByUserId);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());

        Ticket savedTicket = ticketRepository.save(ticket);

        for (MultipartFile file : validFiles) {
            String filePath = fileStorageService.saveFile(file);

            TicketAttachment attachment = new TicketAttachment();
            attachment.setTicket(savedTicket);
            attachment.setFileName(file.getOriginalFilename());
            attachment.setFileType(file.getContentType());
            attachment.setFilePath(filePath);
            attachment.setUploadedAt(LocalDateTime.now());

            savedTicket.getAttachments().add(attachment);
            attachmentRepository.save(attachment);
        }

        return ticketRepository.save(savedTicket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getTicketsByUser(Long userId) {
        return ticketRepository.findByCreatedByUserId(userId);
    }

    public List<Ticket> getTicketsByTechnician(Long technicianId) {
        return ticketRepository.findByAssignedToTechnicianId(technicianId);
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));
    }

    public TicketAttachment getAttachmentById(Long attachmentId) {
        return attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new IllegalArgumentException("Attachment not found"));
    }

    public Ticket assignTechnician(Long ticketId, Long technicianId) {
        if (technicianId == null) {
            throw new IllegalArgumentException("Technician id is required");
        }
        Ticket ticket = getTicketById(ticketId);
        if (ticket.getStatus() == TicketStatus.CLOSED) {
            throw new IllegalArgumentException("Cannot assign a technician to a closed ticket");
        }
        ticket.setAssignedToTechnicianId(technicianId);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public Ticket updateStatus(Long ticketId, TicketStatus newStatus) {
        if (newStatus == null) {
            throw new IllegalArgumentException("Status is required");
        }

        Ticket ticket = getTicketById(ticketId);
        TicketStatus current = ticket.getStatus();

        if (current == TicketStatus.OPEN && newStatus != TicketStatus.IN_PROGRESS) {
            throw new IllegalArgumentException("OPEN ticket can only move to IN_PROGRESS");
        }
        if (current == TicketStatus.IN_PROGRESS && newStatus != TicketStatus.RESOLVED) {
            throw new IllegalArgumentException("IN_PROGRESS ticket can only move to RESOLVED");
        }
        if (current == TicketStatus.RESOLVED && newStatus != TicketStatus.CLOSED) {
            throw new IllegalArgumentException("RESOLVED ticket can only move to CLOSED");
        }
        if (current == TicketStatus.CLOSED) {
            throw new IllegalArgumentException("CLOSED ticket cannot be updated");
        }

        ticket.setStatus(newStatus);
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public Ticket updateResolutionNotes(Long ticketId, String notes) {
        Ticket ticket = getTicketById(ticketId);
        if (ticket.getStatus() != TicketStatus.IN_PROGRESS && ticket.getStatus() != TicketStatus.RESOLVED) {
            throw new IllegalArgumentException("Resolution notes can be added only when ticket is IN_PROGRESS or RESOLVED");
        }
        ticket.setResolutionNotes(notes == null ? "" : notes.trim());
        ticket.setUpdatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public TicketComment addComment(Long ticketId, TicketCommentRequest request) {
        if (request.getUserId() == null) {
            throw new IllegalArgumentException("Comment user id is required");
        }
        if (request.getCommentText() == null || request.getCommentText().trim().isEmpty()) {
            throw new IllegalArgumentException("Comment text is required");
        }

        Ticket ticket = getTicketById(ticketId);

        TicketComment comment = new TicketComment();
        comment.setTicket(ticket);
        comment.setUserId(request.getUserId());
        comment.setCommentText(request.getCommentText().trim());
        comment.setCreatedAt(LocalDateTime.now());

        ticket.setUpdatedAt(LocalDateTime.now());
        ticketRepository.save(ticket);
        return commentRepository.save(comment);
    }

    public List<TicketComment> getComments(Long ticketId) {
        return commentRepository.findByTicketId(ticketId);
    }
}
