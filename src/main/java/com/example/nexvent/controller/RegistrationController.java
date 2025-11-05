package com.example.nexvent.controller;

import com.example.nexvent.dto.RegistrationResponse;
import com.example.nexvent.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {
    
    private final RegistrationService registrationService;

    @PostMapping("/events/{eventId}")
    @ResponseStatus(HttpStatus.CREATED)
    public RegistrationResponse register(
            @PathVariable Long eventId, 
            Authentication auth) {
        return registrationService.registerForEvent(eventId, auth.getName());
    }

    @DeleteMapping("/events/{eventId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancel(
            @PathVariable Long eventId, 
            Authentication auth) {
        registrationService.cancelRegistration(eventId, auth.getName());
    }

    @GetMapping("/my-registrations")
    public List<RegistrationResponse> getMyRegistrations(Authentication auth) {
        return registrationService.getUserRegistrations(auth.getName());
    }

    @GetMapping("/events/{eventId}/check")
    public Map<String, Boolean> checkRegistration(
            @PathVariable Long eventId, 
            Authentication auth) {
        boolean isRegistered = registrationService.isUserRegistered(eventId, auth.getName());
        return Map.of("isRegistered", isRegistered);
    }
}
