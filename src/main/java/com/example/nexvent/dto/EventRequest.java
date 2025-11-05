package com.example.nexvent.dto;

import jakarta.validation.constraints.*;

public record EventRequest(
        @NotBlank(message = "Title is required")
        @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
        String title,
        
        @NotBlank(message = "Description is required")
        @Size(min = 10, max = 4000, message = "Description must be between 10 and 4000 characters")
        String description,
        
        @NotNull(message = "Category is required")
        @Positive(message = "Category ID must be positive")
        Long categoryId,
        
        @NotBlank(message = "Date is required")
        @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Date must be in format YYYY-MM-DD")
        String date,
        
        @NotBlank(message = "Time is required")
        @Pattern(regexp = "\\d{2}:\\d{2}", message = "Time must be in format HH:mm")
        String time,
        
        @NotBlank(message = "Location is required")
        @Size(min = 3, max = 200, message = "Location must be between 3 and 200 characters")
        String location,
        
        @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
        @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
        Double latitude,
        
        @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
        @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
        Double longitude,
        
        @Min(value = 1, message = "Capacity must be at least 1")
        @Max(value = 100000, message = "Capacity cannot exceed 100,000")
        Integer capacity,
        
        @Size(max = 500, message = "Cover URL must not exceed 500 characters")
        String coverUrl
) {
}
