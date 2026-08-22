package com.skyrush.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.skyrush.exception.ApiException;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

/**
 * In-process token-bucket rate limiter applied per user.
 * Each user gets MAX_TOKENS tokens; one is consumed per score submission.
 * Tokens refill at REFILL_RATE_PER_MINUTE per minute.
 * Fine for a single-node deployment; swap for Redis in a multi-node setup.
 */
@Service
public class RateLimiterService {

    private static final int MAX_TOKENS = 10;
    private static final long REFILL_INTERVAL_MS = 60_000L; // 1 minute

    private record Bucket(AtomicInteger tokens, AtomicLong lastRefillMs) {}

    private final ConcurrentMap<Long, Bucket> buckets = new ConcurrentHashMap<>();

    public void checkAndConsume(Long userId) {
        Bucket bucket = buckets.computeIfAbsent(userId,
                id -> new Bucket(new AtomicInteger(MAX_TOKENS), new AtomicLong(System.currentTimeMillis())));

        long now = System.currentTimeMillis();
        long elapsed = now - bucket.lastRefillMs().get();
        if (elapsed >= REFILL_INTERVAL_MS) {
            int refills = (int) (elapsed / REFILL_INTERVAL_MS);
            bucket.tokens().updateAndGet(t -> Math.min(MAX_TOKENS, t + refills));
            bucket.lastRefillMs().set(now);
        }

        if (bucket.tokens().decrementAndGet() < 0) {
            bucket.tokens().incrementAndGet(); // don't go negative
            throw new ApiException(HttpStatus.TOO_MANY_REQUESTS, "RATE_LIMITED",
                    "Score submission rate limit exceeded — please wait before submitting again");
        }
    }
}
