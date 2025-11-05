package com.example.nexvent.repository;

import com.example.nexvent.model.Event;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.*;

public interface EventRepository extends JpaRepository<Event, Long>, JpaSpecificationExecutor<Event> {
@Query("select e from Event e where e.published = true and lower(e.title) like lower (concat('%', :q,'%'))")
    Page<Event> searchByTitle(@Param("q") String q, Pageable pageable);
}