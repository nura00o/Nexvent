package com.example.nexvent.dto;

public record EventRequest(
        String title,
        String description,
        Long categoryId,
        String date,
        String time,
        String location,
        Double latitude,
        Double longitude,
        Integer capacity,
        Boolean published,
        Long price,
        String coverUrl
) {}