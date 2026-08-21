CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('PLAYER','ADMIN') NOT NULL DEFAULT 'PLAYER',
    avatar VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE leaderboard_periods (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status ENUM('ACTIVE','CLOSED') NOT NULL,
    winner_user_id BIGINT NULL,
    CONSTRAINT uq_start_time UNIQUE (start_time),
    CONSTRAINT fk_period_winner FOREIGN KEY (winner_user_id) REFERENCES users(id)
);

CREATE TABLE game_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    status ENUM('ACTIVE','SUBMITTED','EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_status (user_id, status)
);

CREATE TABLE scores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    game_session_id BIGINT NOT NULL UNIQUE,
    leaderboard_period_id BIGINT NOT NULL,
    score INT NOT NULL,
    height INT NOT NULL,
    max_combo INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_score_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_score_session FOREIGN KEY (game_session_id) REFERENCES game_sessions(id),
    CONSTRAINT fk_score_period FOREIGN KEY (leaderboard_period_id) REFERENCES leaderboard_periods(id),
    INDEX idx_period_score (leaderboard_period_id, score DESC)
);
