package com.skyrush.service;

import com.skyrush.entity.*;
import com.skyrush.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

/**
 * Handles weekly leaderboard period rollover.
 * - Closes any active period whose endTime has passed.
 * - Records the winner (top scorer of the closed period).
 * - Creates a new ACTIVE period starting immediately.
 */
@Service
public class RolloverService {

    private static final Logger log = LoggerFactory.getLogger(RolloverService.class);
    private static final long PERIOD_DURATION_DAYS = 7;

    private final LeaderboardPeriodRepository periodRepo;
    private final ScoreRepository scoreRepo;

    public RolloverService(LeaderboardPeriodRepository periodRepo, ScoreRepository scoreRepo) {
        this.periodRepo = periodRepo;
        this.scoreRepo = scoreRepo;
    }

    @Transactional
    public void rolloverIfDue() {
        periodRepo.findByStatus(PeriodStatus.ACTIVE).ifPresentOrElse(
                this::closeAndRollover,
                this::createFirstPeriod
        );
    }

    private void closeAndRollover(LeaderboardPeriod current) {
        if (!current.hasEnded()) return;

        // Assign winner
        var topScores = scoreRepo.findByLeaderboardPeriod_IdOrderByScoreDesc(current.getId(), PageRequest.of(0, 1));
        if (!topScores.isEmpty()) {
            current.setWinnerUser(topScores.getContent().get(0).getUser());
        }
        current.close();
        periodRepo.save(current);
        log.info("Closed leaderboard period {} ending {}", current.getId(), current.getEndTime());

        createNewPeriod();
    }

    private void createFirstPeriod() {
        log.info("No active period found — creating initial leaderboard period");
        createNewPeriod();
    }

    private void createNewPeriod() {
        Instant start = Instant.now();
        Instant end = start.plus(PERIOD_DURATION_DAYS, ChronoUnit.DAYS);
        LeaderboardPeriod period = new LeaderboardPeriod();
        period.setStartTime(start);
        period.setEndTime(end);
        period.setStatus(PeriodStatus.ACTIVE);
        periodRepo.save(period);
        log.info("Created new leaderboard period ending {}", end);
    }
}
