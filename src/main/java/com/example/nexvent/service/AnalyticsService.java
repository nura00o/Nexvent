package com.example.nexvent.service;

import com.example.nexvent.dto.EventAnalyticsResponse;
import com.example.nexvent.exception.ResourceNotFoundException;
import com.example.nexvent.model.Event;
import com.example.nexvent.model.EventRegistration;
import com.example.nexvent.repository.EventRegistrationRepository;
import com.example.nexvent.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final EventRepository eventRepo;
    private final EventRegistrationRepository registrationRepo;

    public EventAnalyticsResponse getEventAnalytics(Long eventId) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", eventId));

        // ✅ правильный метод и сортировка
        List<EventRegistration> allRegistrations =
                registrationRepo.findByEventOrderByCreatedAtDesc(event);

        long totalRegistrations = allRegistrations.size();

        long activeRegistrations = allRegistrations.stream()
                .filter(r -> r.getStatus() == EventRegistration.Status.REGISTERED
                        || r.getStatus() == EventRegistration.Status.PAID)
                .count();

        // ✅ если у тебя статус CANCELED (амер. вариант)
        long canceledRegistrations = allRegistrations.stream()
                .filter(r -> r.getStatus() == EventRegistration.Status.CANCELED)
                .count();

        // ✅ attended пока не поддерживаем (0)
        long attendedCount = 0;

        double registrationRate = (event.getCapacity() != null && event.getCapacity() > 0)
                ? (activeRegistrations * 100.0) / event.getCapacity()
                : 0.0;

        double cancellationRate = totalRegistrations > 0
                ? (canceledRegistrations * 100.0) / totalRegistrations
                : 0.0;

        int availableSlots = event.getCapacity() != null
                ? Math.max(0, event.getCapacity() - (int) activeRegistrations)
                : Integer.MAX_VALUE;

        return new EventAnalyticsResponse(
                event.getId(),
                event.getTitle(),
                event.getCapacity(),
                totalRegistrations,
                activeRegistrations,
                canceledRegistrations,
                attendedCount,
                Math.round(registrationRate * 100.0) / 100.0,
                Math.round(cancellationRate * 100.0) / 100.0,
                availableSlots
        );
    }
}
