# Multi-stage Dockerfile for TRAANA fullstack MVP
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and workspace package files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN cd frontend && npm install
RUN cd backend && npm install

# Copy source files
COPY frontend/ ./frontend/
COPY backend/ ./backend/

# Build frontend to frontend/dist
RUN cd frontend && npm run build

# Production Runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000

# Copy backend dependencies and code
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

COPY backend/ ./backend/
COPY --from=builder /app/frontend/dist ./frontend/dist

EXPOSE 5000

CMD ["node", "backend/server.js"]
