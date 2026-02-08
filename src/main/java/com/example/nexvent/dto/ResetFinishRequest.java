package com.example.nexvent.dto;
public record ResetFinishRequest(String email, String code, String newPassword) {}