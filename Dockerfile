# Use Node.js LTS version
FROM node:20-alpine

# Instalar SQLite y librerías necesarias
RUN apk add --no-cache sqlite sqlite-dev python3 make g++

# Set working directory
WORKDIR /app

# Copy package and prisma files first
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma client
RUN npm install
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Set environment variables with a default value
ENV OPENAI_API_KEY=default-key
ENV DATABASE_URL=file:/app/prisma/dev.db

# Build the application
RUN npm run build

# Initialize database
RUN npx prisma db push

# Expose the port the app runs on
EXPOSE 3000

# Create volume for persistent database storage
VOLUME ["/app/prisma"]

# Start the application
CMD ["npm", "run", "dev"] 