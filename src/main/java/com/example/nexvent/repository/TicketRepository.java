package com.example.nexvent.repository;

import com.example.nexvent.model.Ticket;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query("""
    select coalesce(sum(t.price),0)
    from Ticket t
      join t.registration r
    where r.status = com.example.nexvent.model.EventRegistration.Status.PAID
      and r.event.organizer.id = :orgId
      and (:from is null or r.createdAt >= :from)
      and (:to   is null or r.createdAt < :to)
  """)
    long sumRevenueForOrganizer(@Param("orgId") Long orgId,
                                @Param("from") Instant from,
                                @Param("to") Instant to);

    @Query("""
    select coalesce(sum(t.price),0)
    from Ticket t
      join t.registration r
    where r.status = com.example.nexvent.model.EventRegistration.Status.PAID
      and r.event.id = :eventId
      and r.event.organizer.id = :orgId
      and (:from is null or r.createdAt >= :from)
      and (:to   is null or r.createdAt < :to)
  """)
    long sumRevenueForEvent(@Param("orgId") Long orgId,
                            @Param("eventId") Long eventId,
                            @Param("from") Instant from,
                            @Param("to") Instant to);
}