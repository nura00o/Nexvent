package com.example.nexvent.repository;

import com.example.nexvent.model.Event;
import com.example.nexvent.model.EventRegistration;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {

    boolean existsByUser_IdAndEvent_Id(Long userId, Long eventId);

    List<EventRegistration> findByUser_Id(Long userId);
    List<EventRegistration> findByEvent_Id(Long eventId);
    List<EventRegistration> findByEventOrderByCreatedAtDesc(Event event);


    @Query("""
    select count(r)
    from EventRegistration r
    where r.event.id = :eventId
      and r.status in (
        com.example.nexvent.model.EventRegistration.Status.REGISTERED,
        com.example.nexvent.model.EventRegistration.Status.PAID
      )
  """)
    long countTakenSeats(@Param("eventId") Long eventId);

    // --------- Организатор: totals ----------
    @Query("""
    select count(r)
    from EventRegistration r
    where r.event.organizer.id = :orgId
      and (:from is null or r.createdAt >= :from)
      and (:to is null or r.createdAt < :to)
  """)
    long countAllForOrganizer(@Param("orgId") Long orgId, @Param("from") Instant from, @Param("to") Instant to);

    @Query("""
    select count(r)
    from EventRegistration r
    where r.event.organizer.id = :orgId
      and r.status = com.example.nexvent.model.EventRegistration.Status.PAID
      and (:from is null or r.createdAt >= :from)
      and (:to is null or r.createdAt < :to)
  """)
    long countPaidForOrganizer(@Param("orgId") Long orgId, @Param("from") Instant from, @Param("to") Instant to);

    @Query("""
    select count(r)
    from EventRegistration r
    where r.event.organizer.id = :orgId
      and r.status = com.example.nexvent.model.EventRegistration.Status.CANCELED
      and (:from is null or r.createdAt >= :from)
      and (:to is null or r.createdAt < :to)
  """)
    long countCanceledForOrganizer(@Param("orgId") Long orgId, @Param("from") Instant from, @Param("to") Instant to);

    @Query("""
    select coalesce(sum(r.unitPrice),0)
    from EventRegistration r
    where r.event.organizer.id = :orgId
      and r.status = com.example.nexvent.model.EventRegistration.Status.PAID
      and (:from is null or r.createdAt >= :from)
      and (:to is null or r.createdAt < :to)
  """)
    long sumRevenueForOrganizer(@Param("orgId") Long orgId, @Param("from") Instant from, @Param("to") Instant to);

    // --------- По конкретному событию ----------
    @Query("""
    select count(r)
    from EventRegistration r
    where r.event.id = :eventId and r.event.organizer.id = :orgId
      and (:from is null or r.createdAt >= :from)
      and (:to is null or r.createdAt < :to)
  """)
    long countAllForEvent(@Param("orgId") Long orgId, @Param("eventId") Long eventId,
                          @Param("from") Instant from, @Param("to") Instant to);

    @Query("""
    select count(r)
    from EventRegistration r
    where r.event.id = :eventId and r.event.organizer.id = :orgId
      and r.status = com.example.nexvent.model.EventRegistration.Status.PAID
      and (:from is null or r.createdAt >= :from)
      and (:to is null or r.createdAt < :to)
  """)
    long countPaidForEvent(@Param("orgId") Long orgId, @Param("eventId") Long eventId,
                           @Param("from") Instant from, @Param("to") Instant to);

    @Query("""
    select count(r)
    from EventRegistration r
    where r.event.id = :eventId and r.event.organizer.id = :orgId
      and r.status = com.example.nexvent.model.EventRegistration.Status.CANCELED
      and (:from is null or r.createdAt >= :from)
      and (:to is null or r.createdAt < :to)
  """)
    long countCanceledForEvent(@Param("orgId") Long orgId, @Param("eventId") Long eventId,
                               @Param("from") Instant from, @Param("to") Instant to);

    @Query("""
    select coalesce(sum(r.unitPrice),0)
    from EventRegistration r
    where r.event.id = :eventId and r.event.organizer.id = :orgId
      and r.status = com.example.nexvent.model.EventRegistration.Status.PAID
      and (:from is null or r.createdAt >= :from)
      and (:to is null or r.createdAt < :to)
  """)
    long sumRevenueForEvent(@Param("orgId") Long orgId, @Param("eventId") Long eventId,
                            @Param("from") Instant from, @Param("to") Instant to);
}