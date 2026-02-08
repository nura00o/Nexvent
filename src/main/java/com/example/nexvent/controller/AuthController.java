package com.example.nexvent.controller;

import com.example.nexvent.dto.*;
import com.example.nexvent.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService users;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody RegisterRequest req) {
        users.register(req);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public TokenResponse login(@RequestBody LoginRequest req) {
        return users.login(req);
    }

    @PostMapping("/refresh")
    public TokenResponse refresh(@RequestParam String refreshToken) {
        return users.refresh(refreshToken);
    }

    // Сброс пароля: отправка кода и подтверждение
    @PostMapping("/reset/start")
    public ResponseEntity<Void> startReset(@RequestBody ResetStartRequest req) {
        users.startReset(req);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset/finish")
    public ResponseEntity<Void> finishReset(@RequestBody ResetFinishRequest req) {
        users.finishReset(req);
        return ResponseEntity.ok().build();
    }
}