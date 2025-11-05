package com.example.nexvent.service;

import com.example.nexvent.dto.EventRequest;
import com.example.nexvent.dto.EventResponse;
import com.example.nexvent.model.*;
import com.example.nexvent.repository.*;
import com.example.nexvent.util.EventSpecs;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.time.LocalTime;

@Service @RequiredArgsConstructor
public class EventService {
    private final EventRepository events;
    private final CategoryRepository categories;
    private final UserRepository users;

    public Page<EventResponse> search(String category, String dateFrom, String dateTo, Pageable pageable) {
        Specification<Event> spec = EventSpecs.published();
        if (category != null && !category.isBlank()) spec = spec.and(EventSpecs.byCategoryName(category));
        if (dateFrom != null && !dateFrom.isBlank()) spec = spec.and(EventSpecs.dateFrom(LocalDate.parse(dateFrom)));
        if (dateTo != null && !dateTo.isBlank()) spec = spec.and(EventSpecs.dateTo(LocalDate.parse(dateTo)));
        return events.findAll(spec, pageable).map(this::toDto);
    }

    public EventResponse get(Long id) {
        return events.findById(id).map(this::toDto)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    public EventResponse create(EventRequest req, String organizerEmail) {
        Event e = fromReq(new Event(), req);
        e.setOrganizer(users.findByEmail(organizerEmail).orElseThrow());
        e.setCategory(categories.findById(req.categoryId())
                .orElseThrow(() ->
    new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category with id " + req.categoryId() + " not found")));
                
        return toDto(events.save(e));
    }

    public EventResponse update(Long id, EventRequest req, String organizerEmail) {
        Event e = events.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!e.getOrganizer().getEmail().equals(organizerEmail))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        e = fromReq(e, req);
        e.setCategory(categories.findById(req.categoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,"Bad category")));
        return toDto(events.save(e));
    }

    public void delete(Long id, String organizerEmail) {
        Event e = events.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!e.getOrganizer().getEmail().equals(organizerEmail))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        events.delete(e);
    }

    private Event fromReq(Event e, EventRequest r) {
        e.setTitle(r.title());
        e.setDescription(r.description());
        e.setDate(LocalDate.parse(r.date()));
        e.setTime(LocalTime.parse(r.time()));
        e.setLocation(r.location());
        e.setLatitude(r.latitude());
        e.setLongitude(r.longitude());
        e.setCapacity(r.capacity());
        e.setCoverUrl(r.coverUrl());
        e.setPublished(true);
        return e;
    }

    private EventResponse toDto(Event e) {
        return new EventResponse(
                e.getId(), e.getTitle(), e.getDescription(),
                e.getCategory()!=null? e.getCategory().getName(): null,
                e.getDate()!=null? e.getDate().toString(): null,
                e.getTime()!=null? e.getTime().toString(): null,
                e.getLocation(), e.getLatitude(), e.getLongitude(),
                e.getCapacity(), e.isPublished(), e.getCoverUrl(),
                e.getOrganizer()!=null? e.getOrganizer().getId(): null
        );
    }
}
