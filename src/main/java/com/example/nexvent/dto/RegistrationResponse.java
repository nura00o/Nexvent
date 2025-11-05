package com.example.nexvent.dto;

public record RegistrationResponse(
        Long id,
        Long eventId,
        String eventTitle,
        Long userId,
        String userFullName,
        String status,
        String registeredAt,
        String cancelledAt
) {
}
