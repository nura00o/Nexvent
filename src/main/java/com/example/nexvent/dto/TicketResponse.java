package com.example.nexvent.dto;

public record TicketResponse(Long id, String ticketCode, String qrData, Long price) {}
