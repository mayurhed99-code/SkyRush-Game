package com.skyrush.repository;

import com.skyrush.entity.LeaderboardPeriod;
import com.skyrush.entity.PeriodStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface LeaderboardPeriodRepository extends JpaRepository<LeaderboardPeriod, Long> {
    Optional<LeaderboardPeriod> findByStatus(PeriodStatus status);
    Optional<LeaderboardPeriod> findByStartTime(Instant startTime);
    Page<LeaderboardPeriod> findByStatusOrderByStartTimeDesc(PeriodStatus status, Pageable pageable);
}
