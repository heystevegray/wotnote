FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application with standalone output
RUN npm run build

# Create a new stage for the production image
FROM node:20-alpine AS runner

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./

# Don't give the scripts root permission
COPY --chown=node:node --from=builder /app/scripts/start.sh /app/start.sh

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["./start.sh"]