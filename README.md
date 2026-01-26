# Threadr

Threadr is a real-time, server-based chat application designed for seamless group communication. It provides a premium user experience with instant updates, role-based access control, and a sleek, Discord-inspired interface.

Note: Threadr is optimized for desktop and laptop screens (wide screens) and is not currently supported on mobile devices.

## Features

- **Real-Time Messaging**: Built on Socket.io for instantaneous communication and UI synchronization.
- **Role-Based Access Control (RBAC)**: Comprehensive permission system allowing Admins to manage servers and rooms while providing a clean interface for Members.
- **Server & Room Organization**: Create multiple servers and organize them into dedicated rooms for focused discussions.
- **Smart Invite System**: Quickly grow your community with unique, shareable invite links.
- **Secure Authentication**: JWT-based auth with automatic token refreshing and seamless session persistence.
- **Premium UI/UX**: A dark mode interface built with Next.js, Tailwind CSS, and Shadcn UI.

## Tech Stack

### Frontend
- Framework: Next.js (App Router)
- State Management: Zustand
- Data Fetching: TanStack Query (React Query)
- Real-time: Socket.io Client
- Styling: Tailwind CSS & Shadcn UI

### Backend
- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT (JSON Web Tokens)
- Validation: Zod
- Logging: Pino

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mini-chat-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` directory:
     ```env
     PORT=5001
     MONGO_URI=your_mongodb_uri
     ACCESS_SECRET=your_access_secret
     REFRESH_SECRET=your_refresh_secret
     CLIENT_URL=http://localhost:3000
     NODE_ENV=development
     ```
   - Start the server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```
   - Create a `.env.local` file in the `frontend` directory:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
     NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```

## Architecture Highlights

- **Data Invalidation**: Uses React Query to automatically refresh UI components derived from real-time socket events.
- **Middleware Security**: Robust backend middleware for authenticating both REST requests and Socket connections.
- **TypeScript**: Fully typed codebase for developer productivity and reduced runtime errors.

## License

Distributed under the ISC License.
