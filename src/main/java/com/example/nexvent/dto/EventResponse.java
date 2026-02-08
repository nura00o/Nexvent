package com.example.nexvent.dto;

public record EventResponse(
        Long id,
        String title,
        String description,
        String category,
        String date,
        String time,
        String location,
        Double latitude,
        Double longitude,
        Integer capacity,
        boolean published,
        Long price,
        String coverUrl,
        Long organizerId
) {}