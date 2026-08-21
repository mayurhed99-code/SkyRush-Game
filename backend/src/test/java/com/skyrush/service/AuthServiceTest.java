package com.skyrush.service;

import com.skyrush.dto.auth.LoginRequest;
import com.skyrush.dto.auth.RegisterRequest;
import com.skyrush.entity.Role;
import com.skyrush.entity.User;
import com.skyrush.exception.ApiException;
import com.skyrush.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    private UserRepository userRepository;
    private JwtService jwtService;
    private AuthService authService;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        jwtService = mock(JwtService.class);
        authService = new AuthService(userRepository, encoder, jwtService);
    }

    @Test
    void registerRejectsDuplicateUsername() {
        when(userRepository.existsByUsername("mayur")).thenReturn(true);
        RegisterRequest req = new RegisterRequest("mayur", "m@example.com", "password123");
        assertThatThrownBy(() -> authService.register(req)).isInstanceOf(ApiException.class);
    }

    @Test
    void registerHashesPasswordAndSavesUser() {
        when(userRepository.existsByUsername("mayur")).thenReturn(false);
        when(userRepository.existsByEmail("m@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
        when(jwtService.generateAccessToken(any(), any())).thenReturn("access-token");
        when(jwtService.generateRefreshToken(any())).thenReturn("refresh-token");

        var response = authService.register(new RegisterRequest("mayur", "m@example.com", "password123"));

        assertThat(response.accessToken()).isEqualTo("access-token");
        assertThat(response.user().username()).isEqualTo("mayur");
    }

    @Test
    void loginRejectsWrongPassword() {
        User user = new User();
        user.setUsername("mayur");
        user.setPasswordHash(encoder.encode("correct-password"));
        user.setRole(Role.PLAYER);
        when(userRepository.findByUsername("mayur")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> authService.login(new LoginRequest("mayur", "wrong-password")))
                .isInstanceOf(ApiException.class);
    }
}
