package com.example.nexvent.model;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
@Entity @Getter @Setter@NoArgsConstructor@AllArgsConstructor
public class ResetToken {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false) private User user;
    @Column(unique = true, nullable = false)
    private String token;
    @Column(nullable = false)
    private Instant expiresAt;
}
