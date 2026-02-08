package com.example.nexvent.dto;

import java.util.List;

public record UserSummaryDto(
        Long id,
        String email,
        String fullName,
        boolean enabled,
        boolean locked,
        List<String> roles
) {}