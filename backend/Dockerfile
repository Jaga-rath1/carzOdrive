# ==============================================================================
# CARZODRIVE PRODUCTION DOCKERFILE (GOOGLE CLOUD PLATFORM / CLOUD RUN READY)
# ==============================================================================
FROM node:20-alpine AS runner

# Create app directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
# Google Cloud Run injects PORT environment variable dynamically (defaults to 8080)
ENV PORT=8080

# Install dependencies with clean production install
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

# Copy source code and assets
COPY src/ ./src/
COPY public/ ./public/

# Ensure non-root node user for container security
USER node

# Expose port (Cloud Run defaults to 8080)
EXPOSE 8080

# Start production server
CMD ["node", "src/server.js"]
