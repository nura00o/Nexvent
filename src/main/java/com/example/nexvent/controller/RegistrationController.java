package com.example.nexvent.controller;

import com.example.nexvent.dto.RegistrationDto;
import com.example.nexvent.model.User;
import com.example.nexvent.service.CurrentUser;
import com.example.nexvent.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;
    private final CurrentUser currentUser;

    @PostMapping("/events/{eventId}")
    public RegistrationDto register(@PathVariable Long eventId, Authentication auth) {
        User me = currentUser.get(auth);
        return registrationService.register(me, eventId);
    }

    @GetMapping("/my")
    public List<RegistrationDto> my(Authentication auth) {
        User me = currentUser.get(auth);
        return registrationService.myRegistrations(me);
    }

    @PatchMapping("/{registrationId}/cancel")
    public void cancel(@PathVariable Long registrationId, Authentication auth) {
        User me = currentUser.get(auth);
        registrationService.cancel(me, registrationId);
    }

    @PreAuthorize("hasAnyRole('ROLE_ORGANIZER','ROLE_ADMIN')")
    @PatchMapping("/{registrationId}/mark-paid")
    public void markPaid(@PathVariable Long registrationId, Authentication auth) {
        User me = currentUser.get(auth);
        registrationService.markPaid(registrationId, me);
    }
}
