package com.example.nexvent.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class JwtService {
    private final Key key;
    private final long accessExp;
    private final long refreshExp;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.accessExpirationMs}") long accessExp,
            @Value("${app.jwt.refreshExpirationMs}") long refreshExp) {

        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessExp = accessExp;
        this.refreshExp = refreshExp;
    }

    public String generateAccess(String email, Long uid, Collection<? extends GrantedAuthority> auth) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("uid", uid);
        claims.put("roles", auth.stream().map(GrantedAuthority::getAuthority).toList());
        return build(email, claims, accessExp);
    }

    public String generateRefresh(String email, Long uid) {
        Map<String, Object> claims = Map.of("uid", uid, "typ", "refresh");
        return build(email, claims, refreshExp);
    }

    private String build(String subject, Map<String, Object> claims, long expMs) {
        Date now = new Date();
        return Jwts.builder()
                .setClaims(new HashMap<>(claims))
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + expMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }


    public Jws<Claims> parse(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }

    public String getEmail(String token) {
        return parse(token).getBody().getSubject();
    }

    public Long getUid(String token) {
        return parse(token).getBody().get("uid", Number.class).longValue();
    }

    public boolean isRefresh(String token) {
        return "refresh".equals(parse(token).getBody().get("typ", String.class));
    }

    public List<String> getRoles(String token) {
        Claims claims = parse(token).getBody();
        Object raw = claims.get("roles");

        if (raw == null) return List.of();

        if (raw instanceof List<?> list) {
            return list.stream()
                    .filter(Objects::nonNull)
                    .map(Object::toString)
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
        }

        return List.of(raw.toString().trim());
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            String email = getEmail(token);
            return email != null
                    && email.equals(userDetails.getUsername())
                    && !isRefresh(token);

        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
