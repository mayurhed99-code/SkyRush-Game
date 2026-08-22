# SkyRush 🚀

A **real-time competitive jumper game** with a server-authoritative score validation backend and a live-updating leaderboard.

---

## Architecture

```
┌─────────────────────┐        REST / WebSocket (STOMP)       ┌────────────────────────────────┐
│  React 18 + Vite    │ ◄────────────────────────────────────► │  Spring Boot 3.3               │
│  Zustand  │ R-Query │        /api/**  /ws/**                  │  JPA  │  Security  │  Flyway  │
│  Canvas game engine │                                          └───────────┬────────────────────┘
│  Tailwind CSS       │                                                      │ JDBC
└─────────────────────┘                                          ┌───────────┴────────┐
                                                                 │   MySQL 8.0        │
                                                                 └────────────────────┘
```

### Key Design Decisions

| Concern | Decision |
|---|---|
| Physics source-of-truth | `frontend/src/game/Physics.ts` — values mirrored in `AntiCheatService.java` |
| Scoring formula | `ScoreSystem.ts` + `ComboSystem.ts` — backend validates plausibility only |
| HUD throttling | 10 fps via `useGameLoop` to avoid React re-render churn at 60 fps |
| Auth tokens | JWT access (15 min, in-memory) + refresh (7 d, `httpOnly` cookie) |
| Live leaderboard | STOMP `/topic/leaderboard` — React Query cache invalidated on each event |
| Rate limiting | Token-bucket per user (`RateLimiterService`) — 10 submissions/minute |
| Leaderboard rollover | Weekly cron (`RolloverScheduler`) — closes period, records winner, opens new one |
| Anti-cheat | Plausibility bounds on score vs. elapsed session time (`AntiCheatService`) |

---

## Prerequisites

| Tool | Version |
|---|---|
| Java | 21 |
| Maven | 3.9+ (or use `./mvnw`) |
| Node.js | 22 LTS |
| Docker + Compose | Latest (for MySQL) |

---

## Quick Start (local development)

### 1 — Environment

```bash
cp .env.example .env
# Edit .env to set your passwords / JWT secret
```

### 2 — Start MySQL

```bash
docker compose up -d mysql
```

### 3 — Start backend

```bash
cd backend
./mvnw spring-boot:run
```

The backend starts on **http://localhost:8080**.  
Swagger UI: **http://localhost:8080/swagger-ui.html**

### 4 — Start frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on **http://localhost:5173** (with API proxy to `:8080`).

---

## Running Tests

### Frontend (Vitest)

```bash
cd frontend
npm test -- --run
```

### Backend unit tests (no Docker needed)

```bash
cd backend
./mvnw test -Dtest="JwtServiceTest,AuthServiceTest,AntiCheatServiceTest,RateLimiterServiceTest,RolloverServiceTest"
```

### Backend integration tests (Testcontainers — requires Docker)

```bash
cd backend
./mvnw test
```

---

## Production (Docker Compose)

```bash
docker compose up --build
```

Builds the full multi-stage image (Vite build → Spring Boot fat-jar → JRE runtime) and starts both MySQL and the application.

---

## API Reference

### Auth  (`/api/auth`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | — | Register a new player |
| POST | `/login` | — | Log in, receive access token + refresh cookie |
| POST | `/refresh` | — | Refresh access token using `httpOnly` cookie |
| POST | `/logout` | — | Clear refresh cookie |
| GET | `/me` | Bearer | Fetch own profile |

### Game  (`/api/game`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/session/start` | Bearer | Create an ACTIVE game session, get `sessionId` |
| POST | `/session/submit` | Bearer | Submit score for a session (rate-limited 10/min; anti-cheat validated) |

### Leaderboard  (`/api/leaderboard`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/current` | Bearer | Current period top scores (paginated) |
| GET | `/period/{id}` | Bearer | Historical period scores (paginated) |

### Admin  (`/api/admin`)

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/users` | Bearer + ADMIN | List all users (paginated) |
| DELETE | `/users/{id}` | Bearer + ADMIN | Delete a user |

### WebSocket  (`/ws`)

Connect via SockJS + STOMP.  
Subscribe to **`/topic/leaderboard`** to receive `LiveScoreEvent { username, score, height }` after each score submission.

---

## Game Engine (frontend)

All game logic lives in `frontend/src/game/` and is **pure TypeScript with zero React dependencies**:

| Module | Responsibility |
|---|---|
| `Physics.ts` | `GRAVITY`, `JUMP_VELOCITY`, `MAX_FALL_SPEED`; `applyGravity`, `integratePosition` |
| `Collision.ts` | AABB overlap + one-way top-landing detection |
| `PlatformManager.ts` | Deterministic seeded PRNG, platform spawn/recycle, breakables |
| `ComboSystem.ts` | Multiplier table (1.0 → 3.0) |
| `ScoreSystem.ts` | `computeLandingPoints`, `computeHeightBonus`, `computeBreakBonus` |
| `DifficultySystem.ts` | Height-based `breakableChance` and `verticalGap` scaling |
| `Player.ts` | Physics wrapper (velocity, position, AABB rect) |
| `Camera.ts` | One-way scroll (only scrolls up, never down) |
| `GameLoop.ts` | Fixed-timestep accumulator (default 60 fps) |
| `GameEngine.ts` | Orchestrator — wires all modules, exposes `GameState` snapshot |

---

## Project Structure

```
SkyRush-Game/
├── backend/                     Spring Boot 3.3
│   └── src/main/java/com/skyrush/
│       ├── config/              SecurityConfig, WebSocketConfig
│       ├── controller/          Auth, Game, Leaderboard, Admin
│       ├── dto/                 Request/Response records
│       ├── entity/              User, GameSession, Score, LeaderboardPeriod
│       ├── exception/           ApiException hierarchy + GlobalExceptionHandler
│       ├── repository/          Spring Data JPA repositories
│       ├── scheduler/           RolloverScheduler
│       ├── security/            JwtAuthFilter, CustomUserDetails(Service)
│       ├── service/             Auth, Game, Leaderboard, Rollover, AntiCheat, RateLimiter, Jwt
│       └── websocket/           LiveScorePublisher
├── frontend/                    Vite + React 18 + TypeScript
│   └── src/
│       ├── game/                Pure-TS game engine (no React imports)
│       ├── stores/              Zustand: authStore, gameStore
│       ├── hooks/               useAuth, useGameLoop, useLeaderboard, useLiveLeaderboard
│       ├── services/            api (axios+interceptor), authService, gameService, leaderboardService
│       ├── components/          GameCanvas, Hud, GameOverModal, LoginForm, RegisterForm, ProtectedRoute
│       └── pages/               HomePage, LoginPage, RegisterPage, GamePage, LeaderboardPage
├── .github/workflows/ci.yml     GitHub Actions CI
├── Dockerfile                   Multi-stage production build
├── docker-compose.yml           MySQL + app services
└── .env.example                 Environment variable template
```

---

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs on every push/PR to `master`:

1. **Frontend tests** — `vitest --run`
2. **Backend unit tests** — no Docker needed
3. **Backend integration tests** — Testcontainers (requires Docker-in-Docker on runner)
4. **Docker build** — validates the multi-stage `Dockerfile`
