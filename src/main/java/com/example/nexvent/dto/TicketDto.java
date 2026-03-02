package com.example.nexvent.dto;


public record TicketDto(
        Long ticketId,
        Long registrationId,
        String ticketCode,
        String qrData,
        Long price,
        String registrationStatus,
        Long eventId,
        String eventTitle
) {}