package com.skyrush.service;

import com.skyrush.exception.InvalidScoreException;
import org.springframework.stereotype.Service;

/**
 * Server-side plausibility bounds for submitted scores.
 *
 * These constants MUST be kept in sync with the frontend physics/score constants:
 *   GRAVITY          = 1400 px/s^2   (Physics.ts)
 *   JUMP_VELOCITY    = -620 px/s     (Physics.ts)
 *   BASE_LANDING_PTS = 100           (ScoreSystem.ts)
 *   HEIGHT_BONUS/100 = 5             (ScoreSystem.ts)
 *   BREAK_BONUS      = 25            (ScoreSystem.ts)
 *   MAX_MULTIPLIER   = 3.0           (ComboSystem.ts, combo>=5)
 *   MAX_JUMP_HEIGHT  ≈ v²/(2g) = 136 px
 *   MAX_PLATFORMS_PER_MIN ≈ 60s/(jump_time≈0.9s) ≈ 66 platforms
 */
@Service
public class AntiCheatService {

    // Derived from jump physics: ~0.9s round-trip; 10h session = max 36000 platform landings
    private static final int MAX_LANDINGS_PER_SECOND = 2;
    // BASE_LANDING_POINTS * MAX_MULTIPLIER * MAX_LANDINGS_PER_SECOND * 10h + generous height bonus
    private static final int ABSOLUTE_MAX_SCORE = 300_000;

    // Generous upper bound: could theoretically reach 50 000 px with very fast play
    private static final int MAX_HEIGHT = 100_000;
    // Rough max combo achievable in a session
    private static final int MAX_COMBO = 10_000;

    public void validate(int score, int height, int maxCombo, long sessionDurationSeconds) {
        if (score < 0) throw new InvalidScoreException("Score must be non-negative");
        if (height < 0) throw new InvalidScoreException("Height must be non-negative");
        if (maxCombo < 0) throw new InvalidScoreException("maxCombo must be non-negative");
        if (score > ABSOLUTE_MAX_SCORE) {
            throw new InvalidScoreException("Score exceeds absolute maximum for a single session");
        }
        if (height > MAX_HEIGHT) {
            throw new InvalidScoreException("Height exceeds physical maximum");
        }
        if (maxCombo > MAX_COMBO) {
            throw new InvalidScoreException("maxCombo exceeds physical maximum");
        }
        if (sessionDurationSeconds < 1) {
            throw new InvalidScoreException("Session duration too short to achieve a score");
        }
        int maxPossibleScore = (int) (sessionDurationSeconds * MAX_LANDINGS_PER_SECOND * 100 * 3.0) + 10_000;
        if (score > maxPossibleScore) {
            throw new InvalidScoreException("Score is not plausible for the elapsed session time");
        }
    }
}
