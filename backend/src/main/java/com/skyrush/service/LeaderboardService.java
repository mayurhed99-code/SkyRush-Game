package com.skyrush.service;

import com.skyrush.dto.leaderboard.LeaderboardEntryResponse;
import com.skyrush.dto.leaderboard.LeaderboardPageResponse;
import com.skyrush.entity.LeaderboardPeriod;
import com.skyrush.entity.PeriodStatus;
import com.skyrush.exception.ApiException;
import com.skyrush.repository.LeaderboardPeriodRepository;
import com.skyrush.repository.ScoreRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.atomic.AtomicInteger;

@Service
public class LeaderboardService {

    private final LeaderboardPeriodRepository periodRepo;
    private final ScoreRepository scoreRepo;

    public LeaderboardService(LeaderboardPeriodRepository periodRepo, ScoreRepository scoreRepo) {
        this.periodRepo = periodRepo;
        this.scoreRepo = scoreRepo;
    }

    @Transactional(readOnly = true)
    public LeaderboardPageResponse getCurrentLeaderboard(int page, int size) {
        LeaderboardPeriod period = periodRepo.findByStatus(PeriodStatus.ACTIVE)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "NO_ACTIVE_PERIOD", "No active leaderboard period"));
        return buildPage(period, page, size);
    }

    @Transactional(readOnly = true)
    public LeaderboardPageResponse getLeaderboardForPeriod(Long periodId, int page, int size) {
        LeaderboardPeriod period = periodRepo.findById(periodId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "PERIOD_NOT_FOUND", "Leaderboard period not found"));
        return buildPage(period, page, size);
    }

    private LeaderboardPageResponse buildPage(LeaderboardPeriod period, int page, int size) {
        var scorePage = scoreRepo.findByLeaderboardPeriod_IdOrderByScoreDesc(period.getId(), PageRequest.of(page, size));
        AtomicInteger rank = new AtomicInteger(page * size + 1);
        var entries = scorePage.getContent().stream()
                .map(s -> new LeaderboardEntryResponse(
                        rank.getAndIncrement(),
                        s.getUser().getId(),
                        s.getUser().getUsername(),
                        s.getUser().getAvatar(),
                        s.getScore(),
                        s.getHeight(),
                        s.getMaxCombo(),
                        s.getCreatedAt()
                ))
                .toList();
        return new LeaderboardPageResponse(
                period.getId(), period.getStartTime(), period.getEndTime(),
                period.getStatus().name(), page, scorePage.getTotalPages(), entries
        );
    }
}
