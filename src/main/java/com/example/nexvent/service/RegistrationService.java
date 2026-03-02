package com.example.nexvent.service;

import com.example.nexvent.dto.RegistrationDto;
import com.example.nexvent.dto.TicketDto;
import com.example.nexvent.model.*;
import com.example.nexvent.repository.*;
import org.springframework.security.core.Authentication;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrationService {
    private final EventRepository events;
    private final EventRegistrationRepository regs;
    private final TicketService ticketService;
    private final EventRegistrationRepository registrations;
    private final TicketRepository tickets;

    public TicketDto getTicketForRegistration(Long registrationId, Authentication auth) {
        EventRegistration reg = registrations.findById(registrationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registration not found"));

        // владелец или ADMIN/ORGANIZER
        String email = auth.getName();

        boolean isOwner = reg.getUser() != null
                && reg.getUser().getEmail() != null
                && reg.getUser().getEmail().equalsIgnoreCase(email);

        boolean isAdminOrOrg = auth.getAuthorities().stream().anyMatch(a ->
                "ROLE_ADMIN".equals(a.getAuthority()) || "ROLE_ORGANIZER".equals(a.getAuthority())
        );

        if (!isOwner && !isAdminOrOrg) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No access to this ticket");
        }

        Ticket ticket = tickets.findByRegistrationId(registrationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));

        return new TicketDto(
                ticket.getId(),
                reg.getId(),
                ticket.getTicketCode(),
                ticket.getQrData(),
                ticket.getPrice(),
                reg.getStatus().name(),
                reg.getEvent().getId(),
                reg.getEvent().getTitle()
        );
    }


    public RegistrationDto register(User user, Long eventId) {
        Event event = events.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));

        if (!event.isPublished())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Event is not published");

        if (regs.existsByUser_IdAndEvent_Id(user.getId(), eventId))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already registered");

        if (event.getCapacity() != null) {
            long taken = regs.countTakenSeats(eventId);
            if (taken >= event.getCapacity())
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Capacity reached");
        }

        EventRegistration r = new EventRegistration();
        r.setUser(user);
        r.setEvent(event);

        r.setUnitPrice(event.getPrice() == null ? 0L : event.getPrice());

        r = regs.save(r);

        return new RegistrationDto(r.getId(), event.getId(), event.getTitle(), r.getStatus().name(), r.getUnitPrice());
    }

    public void cancel(User user, Long registrationId) {
        EventRegistration r = regs.findById(registrationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registration not found"));

        if (!r.getUser().getId().equals(user.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        r.setStatus(EventRegistration.Status.CANCELED);
        regs.save(r);
    }

    public List<RegistrationDto> myRegistrations(User user) {
        return regs.findByUser_Id(user.getId()).stream()
                .map(r -> new RegistrationDto(r.getId(), r.getEvent().getId(), r.getEvent().getTitle(), r.getStatus().name(), r.getUnitPrice()))
                .toList();
    }

    public List<RegistrationDto> forEvent(Long eventId, User organizer) {
        Event event = events.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));

        if (!event.getOrganizer().getId().equals(organizer.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        return regs.findByEvent_Id(eventId).stream()
                .map(r -> new RegistrationDto(r.getId(), eventId, event.getTitle(), r.getStatus().name(), r.getUnitPrice()))
                .toList();
    }

    public void markPaid(Long registrationId, User organizer) {
        EventRegistration r = regs.findById(registrationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registration not found"));

        if (!r.getEvent().getOrganizer().getId().equals(organizer.getId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);

        r.setStatus(EventRegistration.Status.PAID);
        regs.save(r);

        ticketService.issueFor(r);
    }

}