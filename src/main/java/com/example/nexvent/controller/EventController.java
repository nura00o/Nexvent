package com.example.nexvent.controller;

import com.example.nexvent.dto.EventResponse;
import com.example.nexvent.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService events;

    @GetMapping
    public Page<EventResponse> list(@RequestParam(defaultValue="0") int page,
                                    @RequestParam(defaultValue="12") int size) {
        return events.publicList(PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    public EventResponse get(@PathVariable Long id) { return events.get(id); }
}