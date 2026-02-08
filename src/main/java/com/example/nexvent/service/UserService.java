package com.example.nexvent.service;

import com.example.nexvent.dto.*;
import com.example.nexvent.model.ResetCode;
import com.example.nexvent.model.Role;
import com.example.nexvent.model.User;
import com.example.nexvent.repository.ResetCodeRepository;
import com.example.nexvent.repository.RoleRepository;
import com.example.nexvent.repository.UserRepository;
import com.example.nexvent.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Random;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository users;
    private final RoleRepository roles;
    private final PasswordEncoder encoder;
    private final AuthenticationConfiguration authConfig;
    private final JwtService jwt;
    private final ResetCodeRepository resetCodes;
    private final MailService mailService;

    public void register(RegisterRequest req) {
        users.findByEmail(req.email()).ifPresent(u -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail already in use");
        });

        Role base = roles.findByName("ROLE_USER")
                .orElseGet(() -> roles.save(new Role(null, "ROLE_USER")));

        User u = new User();
        u.setEmail(req.email());
        u.setFullName(req.fullName());
        u.setPassword(encoder.encode(req.password()));
        u.setRoles(Set.of(base));

        users.save(u);
    }

    public TokenResponse login(LoginRequest req) {
        try {
            AuthenticationManager authManager = authConfig.getAuthenticationManager();

            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.email(), req.password())
            );

            UserDetails details = (UserDetails) auth.getPrincipal();
            com.example.nexvent.model.User u = users.findByEmail(details.getUsername()).orElseThrow();

            String access = jwt.generateAccess(u.getEmail(), u.getId(), details.getAuthorities());
            String refresh = jwt.generateRefresh(u.getEmail(), u.getId());
            return new TokenResponse(access, refresh);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
    }


    public TokenResponse refresh(String refreshToken) {
        try {
            if (!jwt.isRefresh(refreshToken)) throw new IllegalArgumentException("Not a refresh token");

            String email = jwt.getEmail(refreshToken);
            User u = users.findByEmail(email).orElseThrow();

            UserDetails details = loadUserByUsername(email);
            String newAccess = jwt.generateAccess(email, u.getId(), details.getAuthorities());
            String newRefresh = jwt.generateRefresh(email, u.getId());
            return new TokenResponse(newAccess, newRefresh);

        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
        }
    }

    // --- Сброс пароля: отправка 6-значного кода на e-mail
    public void startReset(ResetStartRequest req) {
        String email = req.email();

        users.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String code = String.format("%06d", new Random().nextInt(1_000_000));

        ResetCode entity = new ResetCode(
                null,
                email,
                code,
                Instant.now().plus(15, ChronoUnit.MINUTES),
                false
        );

        resetCodes.save(entity);

        mailService.send(
                email,
                "Password reset code",
                "Your reset code: " + code + "\nValid for 15 minutes."
        );
    }

    public void finishReset(ResetFinishRequest req) {
        ResetCode rc = resetCodes.findByEmailAndCodeAndUsedIsFalse(req.email(), req.code())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid code"));

        if (rc.getExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Code expired");
        }

        User u = users.findByEmail(req.email()).orElseThrow();
        u.setPassword(encoder.encode(req.newPassword()));
        users.save(u);

        rc.setUsed(true);
        resetCodes.save(rc);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User u = users.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("not found"));

        var authorities = u.getRoles().stream()
                .map(r -> new SimpleGrantedAuthority(r.getName()))
                .toList();

        // ВАЖНО: тут используется Spring Security User — поэтому указали FQCN
        return new org.springframework.security.core.userdetails.User(
                u.getEmail(),
                u.getPassword(),
                u.isEnabled(),
                true,
                true,
                !u.isLocked(),
                authorities
        );
    }
}
