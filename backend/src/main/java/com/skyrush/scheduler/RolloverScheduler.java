package com.skyrush.scheduler;

import com.skyrush.service.RolloverService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class RolloverScheduler {

    private final RolloverService rolloverService;

    public RolloverScheduler(RolloverService rolloverService) {
        this.rolloverService = rolloverService;
    }

    /**
     * Checks every hour on the hour whether the current leaderboard period has ended.
     * On first app startup, also checks immediately (the initialDelay of 0 via fixedRate
     * is replaced by the @Scheduled cron to avoid startup side-effects in tests).
     */
    @Scheduled(cron = "0 0 * * * *") // every hour on the hour
    public void roll() {
        rolloverService.rolloverIfDue();
    }
}
