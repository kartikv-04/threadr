# Threadr

Threadr is a real-time, server-based chat application designed for seamless group communication. It provides instantaneous updates, role-based access control, and a scalable architecture to support multiple concurrent users and channels.

Note: The application interface is currently optimized for desktop and wide-screen layouts. Mobile support is not yet implemented.

## Core Features

- Real-Time Messaging: Bidirectional, low-latency communication powered by Socket.io.
- Role-Based Access Control (RBAC): Hierarchical permission system for server administration, room management, and standard member access.
- Server and Room Organization: Logical separation of communities into servers, further organized into dedicated contextual rooms.
- Invite System: Secure token-based invitation links for community expansion.
- Authentication: JWT-based authentication flow featuring automatic token refreshing and persistent sessions.
- Continuous Integration: Automated test suites and linting workflows integrated via GitHub Actions.

## Technology Stack

Frontend:
- Framework: Next.js (App Router)
- State Management: Zustand
- Data Synchronization: TanStack Query
- Real-time Client: Socket.io-client
- Styling: Tailwind CSS, Shadcn UI
- Testing: Vitest, React Testing Library

Backend:
- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB via Mongoose
- Authentication: JSON Web Tokens (JWT)
- Validation: Zod
- Logging: Pino

## Local Development Setup

### Prerequisites

Ensure you have the following installed on your local machine:
- Node.js (v18.0.0 or higher)
- MongoDB (Local instance or MongoDB Atlas)
- npm package manager

### Backend Configuration

1. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   ACCESS_SECRET=your_jwt_access_secret
   REFRESH_SECRET=your_jwt_refresh_secret
   CLIENT_URL=http://localhost:3000
   NODE_ENV=development
   ```

3. Start the backend development server:
   ```bash
   npm run dev
   ```

### Frontend Configuration

1. Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Create a `.env` file in the `frontend` directory with the following variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

## Testing

Both the frontend and backend incorporate comprehensive testing suites.

### Backend Tests (Jest)

The backend includes unit and integration tests using Jest and Supertest.

```bash
cd backend
npm run test
```

### Frontend Tests (Vitest)

The frontend includes state management and component tests using Vitest and React Testing Library.

```bash
cd frontend
npm run test
```

## Architecture Notes

- Data Invalidation: The application uses TanStack Query to automatically refresh UI state derived from real-time socket events, ensuring data consistency without manual refetching.
- Middleware Security: The backend implements strict middleware for authenticating both REST endpoints and WebSocket connections to prevent unauthorized access.
- CI/CD: The repository contains both frontend and backend codebases, with GitHub Actions configured to strictly enforce linting and passing tests on pull requests and main branch merges.

## License

Distributed under the ISC License.
