package com.example.nexvent.repository;

import com.example.nexvent.model.Event;
import com.example.nexvent.model.User;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;

public interface EventRepository extends JpaRepository<Event, Long>, JpaSpecificationExecutor<Event> {
    Page<Event> findByPublishedTrue(Pageable pageable);
    Page<Event> findByOrganizer(User organizer, Pageable pageable);
}