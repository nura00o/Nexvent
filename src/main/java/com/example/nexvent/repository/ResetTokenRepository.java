package com.example.nexvent.repository;
import com.example.nexvent.model.ResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface ResetTokenRepository extends JpaRepository<ResetToken, Long> {
    Optional<ResetToken> findByToken(String token);
    void deleteByUser_Id(Long userId);
}
