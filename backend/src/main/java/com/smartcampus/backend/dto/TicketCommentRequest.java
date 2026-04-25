package com.smartcampus.backend.dto;

public class TicketCommentRequest {
    private Long userId;
    private String commentText;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getCommentText() { return commentText; }
    public void setCommentText(String commentText) { this.commentText = commentText; }
}
