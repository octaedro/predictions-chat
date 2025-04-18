# Predictions

A Next.js application for AI-generated predictions from celebrity personas.

## Environment Setup

This project uses OpenAI's API for generating predictions. To set up your environment:

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder with your OpenAI API key:

   ```
   OPENAI_API_KEY=your-actual-api-key-here
   ```

**Note:** The `.env.local` file is automatically excluded from Git to protect your API key. Each developer needs to create their own local copy.

## Running the Application

### Using Docker (Recommended)

This project is containerized with Docker for consistent development and deployment:

1. Make sure you have Docker and Docker Compose installed
2. Build and start the containers:

   ```bash
   docker-compose up -d
   ```

3. The application will be available at [http://localhost:3000](http://localhost:3000)

4. To pass your OpenAI API key to the container, either:

   - Add it to your `.env.local` file which is mounted to the container
   - Or set it directly in the `docker-compose.yml` file:
     ```yaml
     environment:
       - OPENAI_API_KEY=your-api-key-here
     ```

5. To stop the containers:

   ```bash
   docker-compose down
   ```

### Local Development (Without Docker)

If you prefer to run without Docker:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Choose from multiple celebrity personas for predictions
- Real-time prediction generation using OpenAI API
- Responsive design for mobile and desktop

## Technology Stack

- Next.js 14 with App Router
- React and TypeScript
- Redux for state management
- Tailwind CSS for styling
- Prisma ORM with SQLite database
- UUID for user identification
- Docker for containerization
- Jest and React Testing Library for testing

## API Endpoints

The application exposes the following API endpoints:

### Predictions API

- **POST /api/predictions**
  - Generates a prediction based on user input and selected celebrity
  - Requires `question`, `starId`, and `userId` in the request body
  - Stores the prediction history in the database

### History API

- **GET /api/history?userId={userId}**
  - Returns all prediction history for a specific user
  - Example: `http://localhost:3000/api/history?userId=123e4567-e89b-12d3-a456-426614174000`

### Clear History API

- **DELETE /api/clear-history?userId={userId}**
  - Deletes all prediction history for a specific user
  - Useful for maintaining privacy or starting fresh conversations

## Testing

This project uses Jest and React Testing Library for unit tests.

To run all tests:

```bash
npm test
```

To run in watch mode:

```bash
npm run test:watch
```

To generate a coverage report:

```bash
npm run test:coverage
```
