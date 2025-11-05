package com.example.nexvent.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record RegistrationRequest(
        @NotNull(message = "Event ID is required")
        @Positive(message = "Event ID must be positive")
        Long eventId
) {
}
