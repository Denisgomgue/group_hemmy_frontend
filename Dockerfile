# Use the Node.js 22 LTS as a base image
FROM node:22-alpine AS production

# Set working directory
WORKDIR /app

# Accept build arguments
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL

# Set environment variables
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the application code
COPY . .

# Build the application with network resilience
RUN npm run build || (echo "Build failed, retrying..." && sleep 5 && npm run build)

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
