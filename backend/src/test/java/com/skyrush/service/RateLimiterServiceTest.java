package com.skyrush.service;

import com.skyrush.exception.ApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

class RateLimiterServiceTest {

    private RateLimiterService rateLimiter;

    @BeforeEach
    void setUp() { rateLimiter = new RateLimiterService(); }

    @Test
    void allowsTenRequestsBeforeBlocking() {
        for (int i = 0; i < 10; i++) {
            assertThatCode(() -> rateLimiter.checkAndConsume(1L)).doesNotThrowAnyException();
        }
        assertThatThrownBy(() -> rateLimiter.checkAndConsume(1L)).isInstanceOf(ApiException.class);
    }

    @Test
    void isolatesLimitsBetweenUsers() {
        for (int i = 0; i < 10; i++) rateLimiter.checkAndConsume(1L);
        // user 2 still has full bucket
        assertThatCode(() -> rateLimiter.checkAndConsume(2L)).doesNotThrowAnyException();
    }
}
