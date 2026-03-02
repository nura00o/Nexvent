package com.example.nexvent.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminStatsOverviewDto {
    private long usersTotal;
    private long usersLocked;
    private long eventsTotal;
    private long ticketsTotal;
}