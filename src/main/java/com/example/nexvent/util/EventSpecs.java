package com.example.nexvent.util;

import com.example.nexvent.model.Event;
import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDate;

public class EventSpecs {
    public static Specification<Event> published() {
        return (root, q, cb) -> cb.isTrue(root.get("published"));
    }
    public static Specification<Event> byCategoryName(String name) {
        return (root, q, cb) -> cb.equal(root.get("category").get("name"), name);
    }
    public static Specification<Event> dateFrom(LocalDate from) {
        return (root, q, cb) -> cb.greaterThanOrEqualTo(root.get("date"), from);
    }
    public static Specification<Event> dateTo(LocalDate to) {
        return (root, q, cb) -> cb.lessThanOrEqualTo(root.get("date"), to);
    }
}
