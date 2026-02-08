package com.example.nexvent.dto;
public record RegistrationDto(
        Long id,
        Long eventId,
        String eventTitle,
        String status,
        Long unitPrice
) {}