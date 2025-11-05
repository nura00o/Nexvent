package com.example.nexvent.dto;

public record EventAnalyticsResponse(
        Long eventId,
        String eventTitle,
        Integer capacity,
        long totalRegistrations,
        long activeRegistrations,
        long cancelledRegistrations,
        long attendedCount,
        double registrationRate,
        double cancellationRate,
        int availableSlots
) {
}
