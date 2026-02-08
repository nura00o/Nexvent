package com.example.nexvent.controller;

import com.example.nexvent.dto.StatsOverviewDto;
import com.example.nexvent.model.User;
import com.example.nexvent.service.CurrentUser;
import com.example.nexvent.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/organizer/stats")
@RequiredArgsConstructor
public class OrganizerStatsController {

    private final StatsService stats;
    private final CurrentUser current;

    @GetMapping("/overview")
    public StatsOverviewDto overview(
            Authentication auth,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to
    ) {
        User me = current.get(auth);
        return stats.overview(me, from, to);
    }
}
