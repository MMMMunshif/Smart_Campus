package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.TicketAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketAttachmentRepository extends JpaRepository<TicketAttachment, Long> {
}
