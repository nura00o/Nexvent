package com.example.nexvent.service;

import com.example.nexvent.dto.SetRolesRequest;
import com.example.nexvent.dto.UserSummaryDto;
import com.example.nexvent.model.Role;
import com.example.nexvent.model.User;
import com.example.nexvent.repository.RoleRepository;
import com.example.nexvent.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository users;
    private final RoleRepository roles;

    private static final String R_USER = "ROLE_USER";
    private static final String R_ORG  = "ROLE_ORGANIZER";
    private static final String R_ADMIN= "ROLE_ADMIN";
    private static final Set<String> ALLOWED = Set.of(R_USER, R_ORG, R_ADMIN);

    public List<UserSummaryDto> listUsers() {
        return users.findAll().stream().map(this::map).toList();
    }

    @Transactional
    public UserSummaryDto grantOrganizer(Long userId, Authentication adminAuth) {
        User target = requireUser(userId);
        Role org = getOrCreate(R_ORG);
        if (!target.getRoles().contains(org)) {
            target.getRoles().add(org);
            users.save(target);
        }
        return map(target);
    }

    @Transactional
    public UserSummaryDto revokeOrganizer(Long userId, Authentication adminAuth) {
        User target = requireUser(userId);
        Role org = getOrCreate(R_ORG);
        target.getRoles().remove(org);
        // гарантируем, что у пользователя всегда есть хотя бы ROLE_USER
        Role userRole = getOrCreate(R_USER);
        if (target.getRoles().stream().noneMatch(r -> r.getName().equals(R_USER))) {
            target.getRoles().add(userRole);
        }
        users.save(target);
        return map(target);
    }

    @Transactional
    public UserSummaryDto setRoles(Long userId, SetRolesRequest req, Authentication adminAuth) {
        User target = requireUser(userId);
        List<String> requested = Optional.ofNullable(req.roles()).orElse(List.of());

        if (requested.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "roles must not be empty");
        }
        if (!requested.stream().allMatch(ALLOWED::contains)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown role in: " + requested);
        }
        // Всегда иметь ROLE_USER
        if (!requested.contains(R_USER)) {
            requested = new ArrayList<>(requested);
            requested.add(R_USER);
        }

        // Нельзя залочить систему без админов
        boolean removingAdminFromTarget = target.getRoles().stream().anyMatch(r -> r.getName().equals(R_ADMIN))
                && !requested.contains(R_ADMIN);

        if (removingAdminFromTarget) {
            long admins = users.countByRoles_Name(R_ADMIN);
            boolean isSelf = target.getEmail().equalsIgnoreCase(adminAuth.getName());
            if (admins <= 1) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot remove the last admin");
            }
            if (isSelf) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Admin cannot remove own admin role");
            }
        }

        // применяем
        Set<Role> newRoles = requested.stream().map(this::getOrCreate).collect(Collectors.toSet());
        target.setRoles(newRoles);
        users.save(target);
        return map(target);
    }

    @Transactional
    public UserSummaryDto lockUser(Long userId, Authentication adminAuth) {
        User target = requireUser(userId);
        if (target.getEmail().equalsIgnoreCase(adminAuth.getName())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot lock yourself");
        }
        // не допускаем блокировки единственного админа
        boolean isAdmin = target.getRoles().stream().anyMatch(r -> r.getName().equals(R_ADMIN));
        if (isAdmin && users.countByRoles_Name(R_ADMIN) <= 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot lock the last admin");
        }
        target.setLocked(true);
        return map(users.save(target));
    }

    @Transactional
    public UserSummaryDto unlockUser(Long userId) {
        User target = requireUser(userId);
        target.setLocked(false);
        return map(users.save(target));
    }

    private User requireUser(Long id) {
        return users.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Role getOrCreate(String name) {
        return roles.findByName(name).orElseGet(() -> roles.save(new Role(null, name)));
    }

    private UserSummaryDto map(User u) {
        return new UserSummaryDto(
                u.getId(), u.getEmail(), u.getFullName(), u.isEnabled(), u.isLocked(),
                u.getRoles().stream().map(Role::getName).sorted().toList()
        );
    }
}