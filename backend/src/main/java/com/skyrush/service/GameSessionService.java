package com.skyrush.service;

import com.skyrush.dto.game.StartSessionResponse;
import com.skyrush.dto.game.SubmitScoreRequest;
import com.skyrush.dto.game.SubmitScoreResponse;
import com.skyrush.entity.*;
import com.skyrush.exception.*;
import com.skyrush.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class GameSessionService {

    private final GameSessionRepository sessionRepo;
    private final ScoreRepository scoreRepo;
    private final LeaderboardPeriodRepository periodRepo;
    private final AntiCheatService antiCheat;

    public GameSessionService(GameSessionRepository sessionRepo, ScoreRepository scoreRepo,
                               LeaderboardPeriodRepository periodRepo, AntiCheatService antiCheat) {
        this.sessionRepo = sessionRepo;
        this.scoreRepo = scoreRepo;
        this.periodRepo = periodRepo;
        this.antiCheat = antiCheat;
    }

    @Transactional
    public StartSessionResponse startSession(User user) {
        GameSession session = new GameSession();
        session.setUser(user);
        GameSession saved = sessionRepo.save(session);
        return new StartSessionResponse(saved.getId());
    }

    @Transactional
    public SubmitScoreResponse submitScore(User user, SubmitScoreRequest req) {
        GameSession session = sessionRepo.findByIdAndUser_Id(req.sessionId(), user.getId())
                .orElseThrow(SessionNotFoundException::new);

        if (session.getStatus() != SessionStatus.ACTIVE) {
            throw new ApiException(HttpStatus.CONFLICT, "SESSION_NOT_ACTIVE", "Session is not in ACTIVE state");
        }

        // anti-cheat: session must not be too old (e.g. max 10h)
        long elapsed = ChronoUnit.SECONDS.between(session.getStartedAt(), Instant.now());
        if (elapsed > 36000) {
            session.setStatus(SessionStatus.EXPIRED);
            sessionRepo.save(session);
            throw new ApiException(HttpStatus.GONE, "SESSION_EXPIRED", "Session has expired");
        }

        antiCheat.validate(req.score(), req.height(), req.maxCombo(), Math.max(elapsed, 1));

        if (scoreRepo.findByGameSession_Id(session.getId()).isPresent()) {
            throw new DuplicateSubmissionException();
        }

        LeaderboardPeriod period = periodRepo.findByStatus(PeriodStatus.ACTIVE)
                .orElseThrow(() -> new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "NO_ACTIVE_PERIOD",
                        "No active leaderboard period — try again later"));

        session.setStatus(SessionStatus.SUBMITTED);
        session.setEndedAt(Instant.now());
        sessionRepo.save(session);

        Score score = new Score();
        score.setUser(user);
        score.setGameSession(session);
        score.setLeaderboardPeriod(period);
        score.setScore(req.score());
        score.setHeight(req.height());
        score.setMaxCombo(req.maxCombo());
        Score saved = scoreRepo.save(score);

        return new SubmitScoreResponse(saved.getId(), saved.getScore(), saved.getHeight(), saved.getMaxCombo(), saved.getCreatedAt());
    }
}
