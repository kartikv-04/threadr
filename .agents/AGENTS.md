# Agent Rules and Guidelines for Threadr

Welcome to **Threadr**, a real-time, server-based chat application designed for seamless group communication. This file outlines the operational boundaries, architecture, directory structure, coding standards, and quality gates that any AI developer agent must strictly follow.

---

## 1. Operational & Communication Rules
- **Terminal Commands**: ALWAYS explain the exact purpose (**what** it does and **why** it is necessary) of any terminal command before proposing or running it. 
- **Git Commit & Push**: NEVER perform automatic commits (`git commit`) or pushes (`git push`) without explicit user permission. The user manages commit and push cycles manually or grants explicit approval.
- **Clarification**: If a task description or code change is ambiguous, ask the user for clarification rather than making assumptions.

---

## 2. Project Architecture & Scope
Threadr is structured as a monorepo containing distinct backend and frontend codebases:
* **Scope**: A desktop-optimized, real-time Slack/Discord-like chat application featuring servers, rooms, role-based access control (RBAC), and invitation links.
* **Frontend**: Next.js (App Router) written in TypeScript, using:
  - **State Management**: Zustand
  - **Data Sync**: TanStack Query (React Query)
  - **Real-Time Interface**: Socket.io-client
  - **Styling**: Tailwind CSS & Shadcn UI
  - **Testing**: Vitest & React Testing Library
* **Backend**: Node.js and Express.js written in TypeScript, using:
  - **Database**: MongoDB via Mongoose
  - **Authentication**: JWT (JSON Web Tokens) with auto-refreshing sessions
  - **Validation**: Zod (schema validations)
  - **Logging**: Pino logger
  - **Testing**: Jest & Supertest (using `mongodb-memory-server` for database testing)

---

## 3. Directory Structure
```
threadr/
├── .agents/
│   └── AGENTS.md                 # This rules and guidelines file
├── .github/
│   └── workflows/                # CI/CD pipelines enforcing builds, lints, and tests
├── backend/
│   ├── src/
│   │   ├── config/               # DB, Env, and Logger configurations
│   │   ├── controller/           # Express controllers handling route logic
│   │   ├── helper/               # Async handlers, custom utility functions, error classes
│   │   ├── middleware/           # Authentication, authorization (RBAC), error middleware
│   │   ├── models/               # Mongoose schemas (User, Server, Room, Invite, Member)
│   │   ├── routes/               # API route definitions
│   │   ├── service/              # Business logic services
│   │   ├── socket/               # Socket.io handlers (messageHandler, roomHandler)
│   │   ├── validator/            # Zod validation schemas
│   │   └── server.ts             # Express server entry point
│   ├── tests/                    # Integration and unit tests
│   ├── eslint.config.mts         # Backend ESLint Flat Configuration
│   ├── tsconfig.json             # Backend TypeScript configuration
│   └── package.json
└── frontend/
    ├── app/                      # Next.js App Router pages and layout
    ├── components/               # Reusable React UI components
    ├── feature/                  # Feature-specific hooks (e.g. auth hooks), stores, and logic
    ├── eslint.config.mjs         # Frontend Next.js ESLint configuration
    ├── tsconfig.json             # Frontend TypeScript configuration
    └── package.json
```

---

## 4. Development & Quality Control Standards
- **TypeScript**: Use strictly typed TypeScript for all changes. Avoid using `any` unless absolutely necessary and supported by comments explaining why.
- **Code Style & Linting**:
  - Keep components modular, small, and responsive.
  - ESLint and Prettier formatting checks must pass successfully in both directories.
  - Run lints before completing code changes:
    - **Backend**: `npx eslint .`
    - **Frontend**: `npm run lint`
- **Testing**:
  - Do not introduce breaking logic changes that invalidate existing tests.
  - Before declaring a task finished, verify that the local test suites run and pass:
    - **Backend Tests**: `cd backend && npm run test`
    - **Frontend Tests**: `cd frontend && npm run test`
- **Build Checks**:
  - Verify that the production build succeeds locally:
    - **Frontend Build**: `cd frontend && npm run build`
