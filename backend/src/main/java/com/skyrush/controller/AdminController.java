package com.skyrush.controller;

import com.skyrush.dto.profile.ProfileResponse;
import com.skyrush.entity.User;
import com.skyrush.exception.ApiException;
import com.skyrush.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<?> listUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<User> users = userRepository.findAll(
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        var content = users.getContent().stream()
                .map(u -> new ProfileResponse(u.getId(), u.getUsername(), u.getEmail(),
                        u.getRole().name(), u.getAvatar(), u.getCreatedAt()))
                .toList();
        return ResponseEntity.ok(Map.of(
                "page", page, "totalPages", users.getTotalPages(), "users", content
        ));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found"));
        userRepository.delete(u);
        return ResponseEntity.noContent().build();
    }
}
