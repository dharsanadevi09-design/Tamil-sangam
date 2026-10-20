FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source files
COPY . .

# Build React Vite production bundle into dist/
RUN npm run build

# Set environment
ENV PORT=5000
ENV NODE_ENV=production

# Expose server port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
