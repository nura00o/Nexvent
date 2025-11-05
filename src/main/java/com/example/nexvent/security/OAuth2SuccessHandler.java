package com.example.nexvent.security;

import com.example.nexvent.model.Role;
import com.example.nexvent.model.User;
import com.example.nexvent.repository.RoleRepository;
import com.example.nexvent.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.Set;

@Component @RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final UserRepository users;
    private final RoleRepository roles;
    private final JwtUtil jwt;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest req, HttpServletResponse res, Authentication auth) throws IOException {
        OAuth2User ou = (OAuth2User) auth.getPrincipal();
        String email = (String) ou.getAttributes().getOrDefault("email", "");
        String name  = (String) ou.getAttributes().getOrDefault("name", "OAuth User");

        User u = users.findByEmail(email).orElseGet(() -> {
            User nu = new User();
            nu.setEmail(email);
            nu.setFullName(name);
            nu.setEnabled(true);
            nu.setRoles(Set.of(roles.findByName("ROLE_USER").orElseGet(() -> roles.save(new Role(null,"ROLE_USER")))));
            return users.save(nu);
        });

        String token = jwt.generateToken(org.springframework.security.core.userdetails.User
                .withUsername(u.getEmail()).password("N/A").authorities("ROLE_USER").build());

        res.sendRedirect("/#/oauth-success?token=" + token);
    }
}
