package com.example.nexvent.controller;

import com.example.nexvent.dto.SetRolesRequest;
import com.example.nexvent.dto.UserSummaryDto;
import com.example.nexvent.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService admin;

    @GetMapping("/users")
    public List<UserSummaryDto> users() {
        return admin.listUsers();
    }

    @PatchMapping("/users/{id}/grant-organizer")
    public UserSummaryDto grantOrganizer(@PathVariable Long id, Authentication auth) {
        return admin.grantOrganizer(id, auth);
    }

    @PatchMapping("/users/{id}/revoke-organizer")
    public UserSummaryDto revokeOrganizer(@PathVariable Long id, Authentication auth) {
        return admin.revokeOrganizer(id, auth);
    }

    @PutMapping("/users/{id}/roles")
    public UserSummaryDto setRoles(@PathVariable Long id, @RequestBody SetRolesRequest req, Authentication auth) {
        return admin.setRoles(id, req, auth);
    }

    @PatchMapping("/users/{id}/lock")
    public UserSummaryDto lock(@PathVariable Long id, Authentication auth) {
        return admin.lockUser(id, auth);
    }

    @PatchMapping("/users/{id}/unlock")
    public UserSummaryDto unlock(@PathVariable Long id) {
        return admin.unlockUser(id);
    }
}