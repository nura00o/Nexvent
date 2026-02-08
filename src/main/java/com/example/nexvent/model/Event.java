package com.example.nexvent.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Event {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 4000)
    private String description;

    private LocalDate date;
    private LocalTime time;

    private String location;
    private Double latitude;
    private Double longitude;

    private Integer capacity;
    private boolean published = true;

    private Long price = 0L;

    private String coverUrl;

    @ManyToOne(optional = false)
    private Category category;

    @ManyToOne(optional = false)
    private User organizer;
}