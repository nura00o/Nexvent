package com.example.nexvent.service;

import com.example.nexvent.dto.RegisterRequest;
import com.example.nexvent.model.*;
import com.example.nexvent.model.User;
import com.example.nexvent.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.*;
import java.util.Set;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository users;
    private final RoleRepository roles;
    private final ResetTokenRepository resetTokens;
    private final PasswordEncoder encoder;

    public void register(RegisterRequest req) {
        if (users.existsByEmail(req.email()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Бұл пошта қолдануда");
        User u = new User();
        u.setEmail(req.email());
        u.setFullName(req.fullName());
        u.setPassword(encoder.encode(req.password()));
        u.setRoles(Set.of(roles.findByName("ROLE_USER").orElseGet(() -> roles.save(new Role(null, "ROLE_USER")))));
        users.save(u);
    }

    public String initiateReset(String email) {
        User u = users.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Қолданушы табылмады"));
        resetTokens.deleteByUser_Id(u.getId());
        String token = UUID.randomUUID().toString();
        resetTokens.save(new ResetToken(null, u, token, Instant.now().plus(Duration.ofHours(2))));
        return token;
    }

    public void resetPassword(String token, String newPassword) {
        ResetToken rt = resetTokens.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid token"));
        if (rt.getExpiresAt().isBefore(Instant.now()))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token expired");
        User u = rt.getUser();
        u.setPassword(encoder.encode(newPassword));
        users.save(u);
        resetTokens.delete(rt);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User u = users.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("not found"));
        return new org.springframework.security.core.userdetails.User(
                u.getEmail(), u.getPassword(),
                u.isEnabled(), true, true, !u.isLocked(),
                u.getRoles().stream().map(r -> new SimpleGrantedAuthority(r.getName())).toList()
        );
    }
}