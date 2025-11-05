package com.example.nexvent.repository;

import com.example.nexvent.model.EventRegistration;
import com.example.nexvent.model.Event;
import com.example.nexvent.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    
    Optional<EventRegistration> findByUserAndEvent(User user, Event event);
    
    List<EventRegistration> findByUserOrderByRegisteredAtDesc(User user);
    
    List<EventRegistration> findByEventOrderByRegisteredAtDesc(Event event);
    
    @Query("SELECT COUNT(r) FROM EventRegistration r WHERE r.event = :event AND r.status = 'REGISTERED'")
    long countActiveRegistrationsByEvent(@Param("event") Event event);
    
    @Query("SELECT COUNT(r) FROM EventRegistration r WHERE r.event = :event AND r.status = 'CANCELLED'")
    long countCancelledRegistrationsByEvent(@Param("event") Event event);
    
    boolean existsByUserAndEventAndStatus(User user, Event event, EventRegistration.Status status);
}
