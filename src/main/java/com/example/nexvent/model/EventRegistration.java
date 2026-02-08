package com.example.nexvent.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"user_id","event_id"}))
public class EventRegistration {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false) private User user;
    @ManyToOne(optional = false) private Event event;
    @OneToOne(mappedBy = "registration", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Ticket ticket;


    @Enumerated(EnumType.STRING)
    private Status status = Status.REGISTERED;
    private Instant createdAt = Instant.now();

    private Long unitPrice = 0L;

    public enum Status { REGISTERED, CANCELED, PAID }
}