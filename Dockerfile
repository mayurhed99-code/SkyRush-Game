# ── Stage 1: build frontend ────────────────────────────────────────────────────
FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# ── Stage 2: build backend ─────────────────────────────────────────────────────
FROM eclipse-temurin:21-jdk-alpine AS backend-build
WORKDIR /app/backend
COPY backend/.mvn .mvn
COPY backend/mvnw .
COPY backend/pom.xml .
RUN chmod +x mvnw && ./mvnw dependency:go-offline -q
COPY backend/src src
# Skip tests in Docker build — tests run in CI with a real MySQL Testcontainer
RUN ./mvnw package -DskipTests -q

# ── Stage 3: production image ──────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the fat jar
COPY --from=backend-build /app/backend/target/*.jar app.jar

# Copy built frontend into Spring Boot's static resources
COPY --from=frontend-build /app/frontend/dist /app/static

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
