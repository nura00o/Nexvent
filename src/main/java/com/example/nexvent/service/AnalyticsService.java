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

        List<EventRegistration> allRegistrations = registrationRepo.findByEventOrderByRegisteredAtDesc(event);
        
        long totalRegistrations = allRegistrations.size();
        long activeRegistrations = allRegistrations.stream()
                .filter(r -> r.getStatus() == EventRegistration.Status.REGISTERED)
                .count();
        long cancelledRegistrations = allRegistrations.stream()
                .filter(r -> r.getStatus() == EventRegistration.Status.CANCELLED)
                .count();
        long attendedCount = allRegistrations.stream()
                .filter(r -> r.getStatus() == EventRegistration.Status.ATTENDED)
                .count();

        double registrationRate = event.getCapacity() != null && event.getCapacity() > 0
                ? (activeRegistrations * 100.0) / event.getCapacity()
                : 0.0;

        double cancellationRate = totalRegistrations > 0
                ? (cancelledRegistrations * 100.0) / totalRegistrations
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
                cancelledRegistrations,
                attendedCount,
                Math.round(registrationRate * 100.0) / 100.0,
                Math.round(cancellationRate * 100.0) / 100.0,
                availableSlots
        );
    }
}
