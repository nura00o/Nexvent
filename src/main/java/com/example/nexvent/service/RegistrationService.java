package com.example.nexvent.service;

import com.example.nexvent.dto.RegistrationResponse;
import com.example.nexvent.exception.*;
import com.example.nexvent.model.*;
import com.example.nexvent.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegistrationService {
    
    private final EventRegistrationRepository registrationRepo;
    private final EventRepository eventRepo;
    private final UserRepository userRepo;

    @Transactional
    public RegistrationResponse registerForEvent(Long eventId, String userEmail) {
        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", 0L));
        
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", eventId));

        
        var existing = registrationRepo.findByUserAndEvent(user, event);
        if (existing.isPresent()) {
            EventRegistration reg = existing.get();
            if (reg.getStatus() == EventRegistration.Status.REGISTERED) {
                throw new DuplicateRegistrationException("You are already registered for this event");
            } else if (reg.getStatus() == EventRegistration.Status.CANCELLED) {
                
                reg.setStatus(EventRegistration.Status.REGISTERED);
                reg.setRegisteredAt(Instant.now());
                reg.setCancelledAt(null);
                return toDto(registrationRepo.save(reg));
            }
        }

        
        if (event.getCapacity() != null) {
            long activeRegistrations = registrationRepo.countActiveRegistrationsByEvent(event);
            if (activeRegistrations >= event.getCapacity()) {
                throw new EventCapacityExceededException("Event has reached maximum capacity");
            }
        }

        
        EventRegistration registration = new EventRegistration();
        registration.setUser(user);
        registration.setEvent(event);
        registration.setStatus(EventRegistration.Status.REGISTERED);
        registration.setRegisteredAt(Instant.now());

        return toDto(registrationRepo.save(registration));
    }

    @Transactional
    public void cancelRegistration(Long eventId, String userEmail) {
        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", 0L));
        
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", eventId));

        EventRegistration registration = registrationRepo.findByUserAndEvent(user, event)
                .orElseThrow(() -> new ResourceNotFoundException("Registration not found"));

        if (registration.getStatus() == EventRegistration.Status.CANCELLED) {
            throw new BadRequestException("Registration is already cancelled");
        }

        registration.setStatus(EventRegistration.Status.CANCELLED);
        registration.setCancelledAt(Instant.now());
        registrationRepo.save(registration);
    }

    public List<RegistrationResponse> getUserRegistrations(String userEmail) {
        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", 0L));
        
        return registrationRepo.findByUserOrderByRegisteredAtDesc(user)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<RegistrationResponse> getEventRegistrations(Long eventId) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", eventId));
        
        return registrationRepo.findByEventOrderByRegisteredAtDesc(event)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public boolean isUserRegistered(Long eventId, String userEmail) {
        User user = userRepo.findByEmail(userEmail).orElse(null);
        Event event = eventRepo.findById(eventId).orElse(null);
        
        if (user == null || event == null) {
            return false;
        }
        
        return registrationRepo.existsByUserAndEventAndStatus(
                user, event, EventRegistration.Status.REGISTERED);
    }

    private RegistrationResponse toDto(EventRegistration r) {
        return new RegistrationResponse(
                r.getId(),
                r.getEvent().getId(),
                r.getEvent().getTitle(),
                r.getUser().getId(),
                r.getUser().getFullName(),
                r.getStatus().name(),
                r.getRegisteredAt() != null ? r.getRegisteredAt().toString() : null,
                r.getCancelledAt() != null ? r.getCancelledAt().toString() : null
        );
    }
}
