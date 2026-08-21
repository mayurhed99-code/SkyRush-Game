package com.skyrush.service;

import com.skyrush.entity.LeaderboardPeriod;
import com.skyrush.entity.PeriodStatus;
import com.skyrush.repository.LeaderboardPeriodRepository;
import com.skyrush.repository.ScoreRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class RolloverServiceTest {

    private LeaderboardPeriodRepository periodRepo;
    private ScoreRepository scoreRepo;
    private RolloverService rolloverService;

    @BeforeEach
    void setUp() {
        periodRepo = mock(LeaderboardPeriodRepository.class);
        scoreRepo = mock(ScoreRepository.class);
        rolloverService = new RolloverService(periodRepo, scoreRepo);
    }

    @Test
    void createsInitialPeriodWhenNoneExists() {
        when(periodRepo.findByStatus(PeriodStatus.ACTIVE)).thenReturn(Optional.empty());
        rolloverService.rolloverIfDue();
        verify(periodRepo, times(1)).save(any(LeaderboardPeriod.class));
    }

    @Test
    void doesNotRolloverActiveNonExpiredPeriod() {
        LeaderboardPeriod active = new LeaderboardPeriod();
        active.setStartTime(Instant.now().minusSeconds(3600));
        active.setEndTime(Instant.now().plusSeconds(3600)); // not yet expired
        active.setStatus(PeriodStatus.ACTIVE);
        when(periodRepo.findByStatus(PeriodStatus.ACTIVE)).thenReturn(Optional.of(active));
        rolloverService.rolloverIfDue();
        verify(periodRepo, never()).save(any());
    }

    @Test
    void closesExpiredPeriodAndCreatesNew() {
        LeaderboardPeriod expired = new LeaderboardPeriod();
        expired.setStartTime(Instant.now().minusSeconds(7 * 24 * 3600 + 10));
        expired.setEndTime(Instant.now().minusSeconds(10)); // already ended
        expired.setStatus(PeriodStatus.ACTIVE);
        when(periodRepo.findByStatus(PeriodStatus.ACTIVE)).thenReturn(Optional.of(expired));
        when(scoreRepo.findByLeaderboardPeriod_IdOrderByScoreDesc(any(), any())).thenReturn(org.springframework.data.domain.Page.empty());
        rolloverService.rolloverIfDue();
        verify(periodRepo, times(2)).save(any()); // once to close, once to create new
    }
}
