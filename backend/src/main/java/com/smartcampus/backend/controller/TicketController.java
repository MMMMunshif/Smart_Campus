package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.TicketCommentRequest;
import com.smartcampus.backend.dto.TicketResolutionRequest;
import com.smartcampus.backend.dto.TicketStatusUpdateRequest;
import com.smartcampus.backend.model.Ticket;
import com.smartcampus.backend.model.TicketAttachment;
import com.smartcampus.backend.model.TicketCategory;
import com.smartcampus.backend.model.TicketComment;
import com.smartcampus.backend.model.TicketPriority;
import com.smartcampus.backend.service.FileStorageService;
import com.smartcampus.backend.service.TicketService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class TicketController {

    private final TicketService ticketService;
    private final FileStorageService fileStorageService;

    public TicketController(TicketService ticketService, FileStorageService fileStorageService) {
        this.ticketService = ticketService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Ticket createTicket(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam TicketCategory category,
            @RequestParam TicketPriority priority,
            @RequestParam Long createdByUserId,
            @RequestParam(required = false, name = "files") List<MultipartFile> files
    ) throws Exception {
        return ticketService.createTicket(title, description, category, priority, createdByUserId, files);
    }

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/user/{userId}")
    public List<Ticket> getTicketsByUser(@PathVariable Long userId) {
        return ticketService.getTicketsByUser(userId);
    }

    @GetMapping("/technician/{techId}")
    public List<Ticket> getTicketsByTechnician(@PathVariable Long techId) {
        return ticketService.getTicketsByTechnician(techId);
    }

    @GetMapping("/{id}")
    public Ticket getTicket(@PathVariable Long id) {
        return ticketService.getTicketById(id);
    }

    @GetMapping("/attachments/{attachmentId}")
    public ResponseEntity<Resource> viewAttachment(@PathVariable Long attachmentId) throws Exception {
        TicketAttachment attachment = ticketService.getAttachmentById(attachmentId);
        Resource resource = fileStorageService.loadFileAsResource(attachment.getFilePath());
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(attachment.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + attachment.getFileName() + "\"")
                .body(resource);
    }

    @PutMapping("/{id}/assign/{techId}")
    public Ticket assignTechnician(@PathVariable Long id, @PathVariable Long techId) {
        return ticketService.assignTechnician(id, techId);
    }

    @PutMapping("/{id}/status")
    public Ticket updateStatus(@PathVariable Long id,
                               @RequestBody TicketStatusUpdateRequest request) {
        return ticketService.updateStatus(id, request.getStatus());
    }

    @PutMapping("/{id}/resolution")
    public Ticket updateResolution(@PathVariable Long id,
                                   @RequestBody TicketResolutionRequest request) {
        return ticketService.updateResolutionNotes(id, request.getResolutionNotes());
    }

    @PostMapping("/{id}/comments")
    public TicketComment addComment(@PathVariable Long id,
                                    @RequestBody TicketCommentRequest request) {
        return ticketService.addComment(id, request);
    }

    @GetMapping("/{id}/comments")
    public List<TicketComment> getComments(@PathVariable Long id) {
        return ticketService.getComments(id);
    }

    @ExceptionHandler({IllegalArgumentException.class, RuntimeException.class})
    public ResponseEntity<Map<String, String>> handleBadRequest(Exception exception) {
        return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
    }
}
