package com.skyrush.dto.leaderboard;

import java.time.Instant;
import java.util.List;

public record LeaderboardPageResponse(
        Long periodId,
        Instant periodStart,
        Instant periodEnd,
        String periodStatus,
        int page,
        int totalPages,
        List<LeaderboardEntryResponse> entries
) {}
