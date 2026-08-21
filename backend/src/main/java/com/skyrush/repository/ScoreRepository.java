package com.skyrush.repository;

import com.skyrush.entity.Score;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ScoreRepository extends JpaRepository<Score, Long> {
    Optional<Score> findByGameSession_Id(Long gameSessionId);
    Page<Score> findByLeaderboardPeriod_IdOrderByScoreDesc(Long periodId, Pageable pageable);
    Page<Score> findByUser_IdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}
