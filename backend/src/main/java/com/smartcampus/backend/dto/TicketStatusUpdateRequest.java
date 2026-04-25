package com.smartcampus.backend.dto;

import com.smartcampus.backend.model.TicketStatus;

public class TicketStatusUpdateRequest {
    private TicketStatus status;

    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }
}
