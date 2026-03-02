package com.example.nexvent.dto;

public record TicketValidationDto(
        boolean valid,
        String reason,
        String eventTitle,
        String holderName,
        String status
) {}