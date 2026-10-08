# Online Sudoku Arena

A real-time multiplayer Sudoku game built with Node.js, Express, Socket.io, and React.

## Features

- 6-character private room codes
- Host-managed lobby and difficulty selection
- Ready toggles for every player
- Server-authoritative Sudoku generation and validation
- Live multiplayer game flow with Socket.io
- Competitive scoring and leaderboard
- Responsive React UI

## Getting started

1. Install dependencies:
   npm install
2. Start the app:
   npm run dev
3. Open the frontend at http://localhost:5173

The backend runs on http://localhost:3001.

## Scripts

- npm run dev — runs backend and frontend together
- npm run build — builds the client for production
- npm run start — starts the backend server

## Architecture

- `server/` contains the Express + Socket.io backend and Sudoku logic
- `client/` contains the React frontend
