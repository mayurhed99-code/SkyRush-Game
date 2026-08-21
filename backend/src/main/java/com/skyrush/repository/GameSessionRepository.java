package com.skyrush.repository;

import com.skyrush.entity.GameSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface GameSessionRepository extends JpaRepository<GameSession, Long> {
    Optional<GameSession> findByIdAndUser_Id(Long id, Long userId);
}
