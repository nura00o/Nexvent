package com.example.nexvent.repository;
import com.example.nexvent.model.ResetCode;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ResetCodeRepository extends JpaRepository<ResetCode, Long> {
    Optional<ResetCode> findTopByEmailAndUsedIsFalseOrderByIdDesc(String email);
    Optional<ResetCode> findByEmailAndCodeAndUsedIsFalse(String email, String code);
}