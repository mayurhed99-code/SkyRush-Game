package com.skyrush.controller;

import com.skyrush.dto.auth.AuthResponse;
import com.skyrush.dto.auth.LoginRequest;
import com.skyrush.dto.auth.RegisterRequest;
import com.skyrush.dto.auth.UserResponse;
import com.skyrush.exception.ApiException;
import com.skyrush.security.CustomUserDetails;
import com.skyrush.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

record AuthResponseBody(String accessToken, UserResponse user) {}

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final String REFRESH_COOKIE = "refreshToken";
    private static final int REFRESH_COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponseBody> register(@Valid @RequestBody RegisterRequest req) {
        AuthResponse result = authService.register(req);
        return withRefreshCookie(result);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseBody> login(@Valid @RequestBody LoginRequest req) {
        AuthResponse result = authService.login(req);
        return withRefreshCookie(result);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseBody> refresh(@CookieValue(name = REFRESH_COOKIE, required = false) String refreshToken) {
        if (refreshToken == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "MISSING_REFRESH_TOKEN", "No refresh token cookie present");
        }
        AuthResponse result = authService.refresh(refreshToken);
        return withRefreshCookie(result);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        ResponseCookie expired = ResponseCookie.from(REFRESH_COOKIE, "")
                .httpOnly(true).secure(true).sameSite("Strict").path("/").maxAge(0).build();
        return ResponseEntity.ok().header("Set-Cookie", expired.toString()).build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal CustomUserDetails principal) {
        var user = principal.getUser();
        return ResponseEntity.ok(new UserResponse(user.getId(), user.getUsername(), user.getEmail(), user.getRole().name(), user.getAvatar()));
    }

    private ResponseEntity<AuthResponseBody> withRefreshCookie(AuthResponse result) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_COOKIE, result.refreshToken())
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path("/api/auth")
                .maxAge(REFRESH_COOKIE_MAX_AGE_SECONDS)
                .build();
        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(new AuthResponseBody(result.accessToken(), result.user()));
    }
}
