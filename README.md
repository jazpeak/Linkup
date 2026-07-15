#Credits

This project was worked on by **Jazl Anwar Only**.

# Linkup

A minimalist, full-stack MERN web application designed for language exchange. Connect with language partners worldwide through a smart recommendation engine, real-time messaging, and high-quality WebRTC video calling.

## Features

- **Authentication:** Secure user signup and login with JWT and HTTP-only cookies.
- **Smart Recommendations:** Algorithm matching users based on intersecting native and learning languages.
- **Real-time Messaging:** Integrated with `stream-chat-react` for seamless direct messaging.
- **Video Conferencing:** High-quality video and audio calls using `@stream-io/video-react-sdk`.
- **User Profiles:** Customizable profiles with dynamic avatar generation via DiceBear.
- **Modern UI:** Built with React, Tailwind CSS, and DaisyUI for a premium, responsive aesthetic.

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS & DaisyUI (Corporate Theme)
- React Query (Data Fetching & Caching)
- React Router DOM
- Stream Chat & Video SDKs

**Backend:**
- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcryptjs
- Stream API Server Client

## Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Cluster (Atlas)
- Stream API Account (for Chat & Video)

### Environment Variables

Create a `.env` file in the `backend` directory:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_secure_jwt_secret
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
NODE_ENV=development
```

Create a `.env` file in the `frontend` directory:
```env
VITE_STREAM_API_KEY=your_stream_api_key
```

### Installation

1. Clone the repository and install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

2. Start the development servers:
```bash
# In the backend directory
npm run dev

# In the frontend directory (in a new terminal)
npm run dev
```

3. Open `http://localhost:5173` in your browser.

## Architecture & Design Decisions

- **Cookie-Based Auth:** Chosen over localStorage to prevent XSS attacks.
- **Stream API Offloading:** Real-time WebSocket infrastructure is entirely offloaded to Stream to ensure the Node backend remains stateless and horizontally scalable.
- **Optimistic UI:** Utilizes React Query mutations to provide instant feedback before server resolution (e.g. friend requests).
- **Minimalist Aesthetic:** Styled strictly with DaisyUI utility classes to maintain a small CSS bundle footprint and ensure rigorous design consistency.
