package com.example.nexvent.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface SalesNativeRepository extends JpaRepository<com.example.nexvent.model.Event, Long> {

    @Query(value = """
    with regs as (
      select date_trunc(:grp, r.created_at) as bucket,
             count(*) filter (where r.event_id is not null) as registrations,
             count(*) filter (where r.status = 'PAID') as paid,
             coalesce(sum(t.price) filter (where r.status = 'PAID'), 0) as revenue
      from event_registration r
      left join ticket t on t.registration_id = r.id
      join event e on e.id = r.event_id
      where e.organizer_id = :orgId
        and (:from is null or r.created_at >= :from)
        and (:to   is null or r.created_at < :to)
      group by date_trunc(:grp, r.created_at)
      order by bucket
    )
    select bucket, registrations, paid, revenue from regs
    """, nativeQuery = true)
    List<Object[]> timeline(@Param("orgId") Long orgId,
                            @Param("from") Instant from,
                            @Param("to") Instant to,
                            @Param("grp") String group); // 'day' | 'week' | 'month'
}