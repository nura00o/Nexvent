package com.example.nexvent.dto;
public record EventStatsDto(
        Long eventId,
        String title,
        long registrations,
        long paid,
        long canceled,
        long revenue
) {}