# Contributing to SkyRush

## Code Style

- **Backend** — Follow standard Java/Spring Boot conventions; Lombok for boilerplate.
- **Frontend** — TypeScript strict mode; no `any` in production code; game engine must never import React.

## Branching

- `master` — production-ready code, CI must pass.
- Feature branches: `feat/<short-description>`, bug fixes: `fix/<short-description>`.

## Running Tests Before Pushing

```bash
# Frontend
cd frontend && npm test -- --run

# Backend unit tests
cd backend && ./mvnw test -Dtest="JwtServiceTest,AuthServiceTest,AntiCheatServiceTest,RateLimiterServiceTest,RolloverServiceTest"
```

## Anti-Cheat Invariant

> If you change any physics constant in `Physics.ts` or any scoring constant in `ScoreSystem.ts` or `ComboSystem.ts`, you **must** update the corresponding comment block in `AntiCheatService.java` to keep the two environments in sync.

## Adding a New API Endpoint

1. Write a failing integration test in `backend/src/test/`.
2. Implement the endpoint.
3. Verify the test passes.
4. Update the API table in `README.md`.
