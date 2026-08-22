package com.skyrush.dto.profile;

import java.time.Instant;

public record ProfileResponse(
        Long id,
        String username,
        String email,
        String role,
        String avatar,
        Instant createdAt
) {}
