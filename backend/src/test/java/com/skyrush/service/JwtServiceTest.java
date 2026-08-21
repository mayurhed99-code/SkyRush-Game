package com.skyrush.service;

import com.skyrush.entity.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(
            "test-only-secret-not-for-production-use-1234567890",
            15,
            7
        );
    }

    @Test
    void generatesAndParsesAccessToken() {
        String token = jwtService.generateAccessToken("mayur", Role.PLAYER);
        assertThat(jwtService.extractUsername(token)).isEqualTo("mayur");
        assertThat(jwtService.isTokenValid(token, "mayur")).isTrue();
        assertThat(jwtService.isRefreshToken(token)).isFalse();
    }

    @Test
    void generatesRefreshTokenDistinguishableFromAccessToken() {
        String refresh = jwtService.generateRefreshToken("mayur");
        assertThat(jwtService.isRefreshToken(refresh)).isTrue();
    }

    @Test
    void rejectsTokenForWrongUsername() {
        String token = jwtService.generateAccessToken("mayur", Role.PLAYER);
        assertThat(jwtService.isTokenValid(token, "someone-else")).isFalse();
    }
}
