# Stage 1: Build React Frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/client

# Copy frontend package files
COPY client/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY client/ ./

# Build React app for production
RUN npm run build

# Verify build folder exists
RUN ls -la /app/client/build

# Stage 2: Setup Backend with Frontend Build
FROM node:18-alpine

WORKDIR /app

# Install production dependencies
COPY server/package*.json ./
RUN npm install --only=production

# Copy backend source code
COPY server/ ./

# Copy built frontend from previous stage
COPY --from=frontend-build /app/client/build /app/client/build

# Verify frontend files are copied
RUN ls -la /app/client/build

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "server.js"]
