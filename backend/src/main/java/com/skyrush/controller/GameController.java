package com.skyrush.controller;

import com.skyrush.dto.game.StartSessionResponse;
import com.skyrush.dto.game.SubmitScoreRequest;
import com.skyrush.dto.game.SubmitScoreResponse;
import com.skyrush.security.CustomUserDetails;
import com.skyrush.service.GameSessionService;
import com.skyrush.service.RateLimiterService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private final GameSessionService gameSessionService;
    private final RateLimiterService rateLimiterService;

    public GameController(GameSessionService gameSessionService, RateLimiterService rateLimiterService) {
        this.gameSessionService = gameSessionService;
        this.rateLimiterService = rateLimiterService;
    }

    @PostMapping("/session/start")
    public ResponseEntity<StartSessionResponse> startSession(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(gameSessionService.startSession(principal.getUser()));
    }

    @PostMapping("/session/submit")
    public ResponseEntity<SubmitScoreResponse> submitScore(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody SubmitScoreRequest req) {
        rateLimiterService.checkAndConsume(principal.getUser().getId());
        return ResponseEntity.ok(gameSessionService.submitScore(principal.getUser(), req));
    }
}
