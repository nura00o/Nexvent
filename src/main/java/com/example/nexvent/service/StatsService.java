package com.example.nexvent.service;

import com.example.nexvent.dto.StatsOverviewDto;
import com.example.nexvent.model.User;
import com.example.nexvent.repository.EventRegistrationRepository;
import com.example.nexvent.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final EventRepository events;
    private final EventRegistrationRepository regs;

    public StatsOverviewDto overview(User organizer, Instant from, Instant to) {
        long all = regs.countAllForOrganizer(organizer.getId(), from, to);
        long paid = regs.countPaidForOrganizer(organizer.getId(), from, to);
        long canceled = regs.countCanceledForOrganizer(organizer.getId(), from, to);
        long revenue = regs.sumRevenueForOrganizer(organizer.getId(), from, to);

        return new StatsOverviewDto(all, paid, canceled, revenue, java.util.List.of());
    }
}
