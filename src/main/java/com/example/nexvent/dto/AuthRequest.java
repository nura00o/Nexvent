package com.example.nexvent.dto;

import jakarta.validation.constraints.*;

public record AuthRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,
        
        @NotBlank(message = "Password is required")
        String password
) {
}
