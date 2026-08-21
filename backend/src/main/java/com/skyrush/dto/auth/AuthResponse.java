package com.skyrush.dto.auth;

public record AuthResponse(String accessToken, String refreshToken, UserResponse user) {}
