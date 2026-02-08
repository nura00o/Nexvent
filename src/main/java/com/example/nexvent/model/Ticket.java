package com.example.nexvent.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Table(name = "tickets", indexes = {
        @Index(name = "idx_ticket_code", columnList = "ticketCode", unique = true)
})
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 1 билет = 1 регистрация
    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id", unique = true, nullable = false)
    private EventRegistration registration;

    // цена билета (в тыйын/копейках)
    @Column(nullable = false)
    private Long price = 0L;

    // уникальный код билета (удобно для проверки/валидации)
    @Column(nullable = false, unique = true, length = 64)
    private String ticketCode;

    // данные для QR (можно просто строку, фронт уже рисует QR)
    @Column(nullable = false, length = 500)
    private String qrData;

    @Column(nullable = false)
    private Instant issuedAt = Instant.now();
}
