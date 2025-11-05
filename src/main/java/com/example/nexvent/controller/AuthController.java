package com.example.nexvent.controller;

import com.example.nexvent.dto.*;
import com.example.nexvent.security.JwtUtil;
import com.example.nexvent.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

//    @PostMapping("/register")
//    public ResponseEntity<Void> register(@RequestBody RegisterRequest req) {
//        userService.register(req);
//        return ResponseEntity.status(HttpStatus.CREATED).build();
//    }
//заменил на то, что снизу потому что иначе Тут ResponseEntity<Void> = пустой ответ.
//Браузер получает 201 Created, но без JSON.
//Если при этом фронт делает что-то вроде:
//
//const data = await response.json();
//
//то возникает ошибка "Unexpected end of JSON input",
//так как JSON там нет вообще.

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest req) {
        userService.register(req);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "User registered successfully"));
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        UserDetails user = (UserDetails) auth.getPrincipal();
        return ResponseEntity.ok(new AuthResponse(jwtUtil.generateToken(user)));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String,String>> forgot(@RequestParam String email) {
        String token = userService.initiateReset(email);
        return ResponseEntity.ok(Map.of("resetToken",token));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> reset(@RequestParam String token, @RequestParam String newPassword) {
        userService.resetPassword(token, newPassword);
        return ResponseEntity.ok().build();
    }
}
