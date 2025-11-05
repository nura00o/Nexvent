package com.example.nexvent.controller;

import com.example.nexvent.dto.*;
import com.example.nexvent.service.EventService;
import com.example.nexvent.service.AnalyticsService;
import com.example.nexvent.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.util.List;

@RestController @RequestMapping("/api/organizer") @RequiredArgsConstructor
public class OrganizerController {
    private final EventService events;
    private final AnalyticsService analyticsService;
    private final RegistrationService registrationService;

    @PostMapping("/events")
    public EventResponse create(@Valid @RequestBody EventRequest req, Authentication auth) {
        return events.create(req, auth.getName());
    }

    @PutMapping("/events/{id}")
    public EventResponse update(@PathVariable Long id, @Valid @RequestBody EventRequest req, Authentication auth) {
        return events.update(id, req, auth.getName());
    }

    @DeleteMapping("/events/{id}")
    public void delete(@PathVariable Long id, Authentication auth) {
        events.delete(id, auth.getName());
    }

    @GetMapping("/events/{id}/analytics")
    public EventAnalyticsResponse getAnalytics(@PathVariable Long id, Authentication auth) {
        // Verify the event belongs to the organizer (done in EventService if needed)
        return analyticsService.getEventAnalytics(id);
    }

    @GetMapping("/events/{id}/registrations")
    public List<RegistrationResponse> getEventRegistrations(@PathVariable Long id, Authentication auth) {
        return registrationService.getEventRegistrations(id);
    }
}
