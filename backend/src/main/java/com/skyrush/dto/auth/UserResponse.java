package com.skyrush.dto.auth;

public record UserResponse(Long id, String username, String email, String role, String avatar) {}
