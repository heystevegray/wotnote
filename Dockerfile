FROM oven/bun:1 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lockb
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application with standalone output
RUN bun run build

# Create a new stage for the production image
FROM oven/bun:1-slim AS runner

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./

# Don't give the scripts root permission
COPY --chown=bun:bun --from=builder /app/scripts/start.sh /app/start.sh

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["./start.sh"]