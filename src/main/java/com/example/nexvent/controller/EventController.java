package com.example.nexvent.controller;

import com.example.nexvent.dto.EventRequest;
import com.example.nexvent.dto.EventResponse;
import com.example.nexvent.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/events") @RequiredArgsConstructor
public class EventController {
    private final EventService service;

    @GetMapping
    public Page<EventResponse> list(
            @RequestParam(required=false) String category,
            @RequestParam(required=false) String dateFrom,
            @RequestParam(required=false) String dateTo,
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="12") int size) {
        return service.search(category, dateFrom, dateTo, PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    public EventResponse get(@PathVariable Long id) { return service.get(id); }

    @PostMapping
    public EventResponse create(@Valid @RequestBody EventRequest request, Authentication auth) {
        return service.create(request, auth.getName());
    }


}
