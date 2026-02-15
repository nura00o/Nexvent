package com.example.nexvent.service;

import com.example.nexvent.dto.*;
import com.example.nexvent.model.*;
import com.example.nexvent.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.time.LocalTime;

@Service @RequiredArgsConstructor
public class EventService {
    private final EventRepository events;
    private final CategoryRepository categories;

    // Публичный список (только published)
    public Page<EventResponse> publicList(Pageable pageable) {
        return events.findByPublishedTrue(pageable).map(this::map);
    }

    // Список организатора — строго по текущему пользователю
    public Page<EventResponse> myEvents(User organizer, Pageable pageable) {
        return events.findByOrganizer(organizer, pageable).map(this::map);
    }

    @PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
    public EventResponse create(EventRequest req, User organizer) {
        Event e = new Event();
        apply(e, req);
        e.setOrganizer(organizer);
        e = events.save(e);
        return map(e);
    }

    @PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
    public EventResponse update(Long id, EventRequest req, User organizer) {
        Event e = events.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        // Защита: только владелец события или админ
        if (!e.getOrganizer().getId().equals(organizer.getId()) &&
                organizer.getRoles().stream().noneMatch(r -> r.getName().equals("ROLE_ADMIN"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        apply(e, req);
        e = events.save(e);
        return map(e);
    }

    @PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
    public void delete(Long id, User organizer) {
        Event e = events.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!e.getOrganizer().getId().equals(organizer.getId()) &&
                organizer.getRoles().stream().noneMatch(r -> r.getName().equals("ROLE_ADMIN"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        events.delete(e);
    }

    public EventResponse get(Long id) {
        return events.findById(id).map(this::map).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    private void apply(Event e, EventRequest req) {
        e.setTitle(req.title());
        e.setDescription(req.description());
        e.setCategory(categories.findById(req.categoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid category")));
        e.setDate(LocalDate.parse(req.date()));
        e.setTime(LocalTime.parse(req.time()));
        e.setLocation(req.location());
        e.setLatitude(req.latitude());
        e.setLongitude(req.longitude());
        e.setCapacity(req.capacity());
        if (req.published() != null) e.setPublished(req.published());
        e.setCoverUrl(req.coverUrl());

        e.setPrice(req.price() == null ? 0L : req.price());
    }

    private EventResponse map(Event e) {
        return new EventResponse(
                e.getId(), e.getTitle(), e.getDescription(), e.getCategory().getName(),
                e.getDate().toString(),
                e.getTime() != null ? e.getTime().toString() : null,
                e.getLocation(), e.getLatitude(), e.getLongitude(),
                e.getCapacity(), e.isPublished(),
                e.getPrice(),
                e.getCoverUrl(),
                e.getOrganizer().getId()
        );
    }
}