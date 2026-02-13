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

    @OneToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id", unique = true, nullable = false)
    private EventRegistration registration;

    @Column(nullable = false)
    private Long price = 0L;

    @Column(nullable = false, unique = true, length = 64)
    private String ticketCode;

    @Column(nullable = false, length = 500)
    private String qrData;

    @Column(nullable = false)
    private Instant issuedAt = Instant.now();
}
