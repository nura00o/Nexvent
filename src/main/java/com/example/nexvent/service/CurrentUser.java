package com.example.nexvent.service;

import com.example.nexvent.model.User;
import com.example.nexvent.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CurrentUser {
    private final UserRepository users;

    public User get(Authentication auth) {
        return users.findByEmail(auth.getName()).orElseThrow();
    }
}