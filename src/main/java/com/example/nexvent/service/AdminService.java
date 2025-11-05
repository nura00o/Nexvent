package com.example.nexvent.service;

import com.example.nexvent.model.User;
import com.example.nexvent.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service @RequiredArgsConstructor
public class AdminService {
    private final UserRepository users;
    private final EventRepository events;

    public Map<String,Object> overview() {
        long totalUsers = users.count();
        long totalEvents = events.count();
        return Map.of(
                "users", totalUsers,
                "events", totalEvents

        );
    }

    public void setLock(Long userId, boolean lock) {
        User u = users.findById(userId).orElseThrow();
        u.setLocked(lock);
        users.save(u);
    }
}