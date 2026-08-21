package com.skyrush.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "scores")
@Getter @Setter @NoArgsConstructor
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_session_id", nullable = false, unique = true)
    private GameSession gameSession;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leaderboard_period_id", nullable = false)
    private LeaderboardPeriod leaderboardPeriod;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false)
    private Integer height;

    @Column(name = "max_combo", nullable = false)
    private Integer maxCombo;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
