package com.example.nexvent.repository;


import com.example.nexvent.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByRegistrationId(Long registrationId);
    Optional<Ticket> findByTicketCode(String ticketCode);
}