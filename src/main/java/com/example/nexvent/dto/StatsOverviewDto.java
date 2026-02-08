package com.example.nexvent.dto;

import java.util.List;

public record StatsOverviewDto(
        long registrations,
        long paid,
        long canceled,
        long revenue,
        List<EventStatsDto> byEvent
) {}