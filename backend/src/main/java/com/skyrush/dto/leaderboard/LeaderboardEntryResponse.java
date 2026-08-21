package com.skyrush.dto.leaderboard;

import java.time.Instant;

public record LeaderboardEntryResponse(
        int rank,
        Long userId,
        String username,
        String avatar,
        int score,
        int height,
        int maxCombo,
        Instant createdAt
) {}
