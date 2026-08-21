package com.skyrush.dto.game;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record SubmitScoreRequest(
        @NotNull Long sessionId,
        @Min(0) int score,
        @Min(0) int height,
        @Min(0) int maxCombo,
        @Min(0) int platformsBroken
) {}
