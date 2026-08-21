package com.skyrush.service;

import com.skyrush.exception.InvalidScoreException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

class AntiCheatServiceTest {

    private AntiCheatService antiCheat;

    @BeforeEach
    void setUp() { antiCheat = new AntiCheatService(); }

    @Test
    void acceptsReasonableScore() {
        assertThatCode(() -> antiCheat.validate(1500, 3000, 8, 120)).doesNotThrowAnyException();
    }

    @Test
    void rejectsNegativeScore() {
        assertThatThrownBy(() -> antiCheat.validate(-1, 0, 0, 60)).isInstanceOf(InvalidScoreException.class);
    }

    @Test
    void rejectsAbsoluteMaxScore() {
        assertThatThrownBy(() -> antiCheat.validate(300_001, 0, 0, 600)).isInstanceOf(InvalidScoreException.class);
    }

    @Test
    void rejectsImpossibleScoreForShortSession() {
        // A 5-second session cannot produce 50 000 points
        assertThatThrownBy(() -> antiCheat.validate(50_000, 0, 0, 5)).isInstanceOf(InvalidScoreException.class);
    }

    @Test
    void acceptsZeroScoreZeroDuration() {
        // 0 score with short session is fine (player closed immediately)
        assertThatCode(() -> antiCheat.validate(0, 0, 0, 1)).doesNotThrowAnyException();
    }
}
