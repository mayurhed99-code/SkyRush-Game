package com.skyrush.controller;

import com.skyrush.dto.leaderboard.LeaderboardPageResponse;
import com.skyrush.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping("/current")
    public ResponseEntity<LeaderboardPageResponse> getCurrent(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(leaderboardService.getCurrentLeaderboard(page, size));
    }

    @GetMapping("/period/{periodId}")
    public ResponseEntity<LeaderboardPageResponse> getPeriod(
            @PathVariable Long periodId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(leaderboardService.getLeaderboardForPeriod(periodId, page, size));
    }
}
