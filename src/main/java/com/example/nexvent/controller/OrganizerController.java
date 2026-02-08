package com.example.nexvent.controller;

import com.example.nexvent.dto.*;
import com.example.nexvent.model.User;
import com.example.nexvent.service.CurrentUser;
import com.example.nexvent.service.EventService;
import com.example.nexvent.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizer")
@RequiredArgsConstructor
public class OrganizerController {
    private final EventService events;
    private final RegistrationService regs;
    private final CurrentUser current;

    @GetMapping("/my-events")
    public Page<EventResponse> myEvents(Authentication auth,
                                        @RequestParam(defaultValue="0") int page,
                                        @RequestParam(defaultValue="12") int size) {
        User me = current.get(auth);
        return events.myEvents(me, PageRequest.of(page, size));
    }

    @PostMapping("/events")
    public EventResponse create(@RequestBody EventRequest req, Authentication auth) {
        return events.create(req, current.get(auth));
    }

    @PutMapping("/events/{id}")
    public EventResponse update(@PathVariable Long id, @RequestBody EventRequest req, Authentication auth) {
        return events.update(id, req, current.get(auth));
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        events.delete(id, current.get(auth));
        return ResponseEntity.noContent().build();
    }

    // список регистраций на Моё конкретное событие
    @GetMapping("/events/{id}/registrations")
    public List<RegistrationDto> registrations(@PathVariable Long id, Authentication auth) {
        return regs.forEvent(id, current.get(auth));
    }
    @PatchMapping("/registrations/{registrationId}/mark-paid")
    public void markPaid(@PathVariable Long registrationId, Authentication auth) {
        regs.markPaid(registrationId, current.get(auth));
    }
}