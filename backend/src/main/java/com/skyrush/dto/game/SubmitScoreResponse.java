package com.skyrush.dto.game;

import java.time.Instant;

public record SubmitScoreResponse(Long scoreId, int score, int height, int maxCombo, Instant createdAt) {}
