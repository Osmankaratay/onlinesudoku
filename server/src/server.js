import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import {
  DIFFICULTY_SETTINGS,
  calculateScore,
  generatePuzzle,
  validateMove,
} from './gameLogic.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 3001;
const MAX_PLAYERS = 6;

const rooms = new Map();

const createEmptyBoard = () =>
  Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => 0));

const cloneBoard = (board) => board.map((row) => [...row]);

const allCellsMatch = (board, solution) =>
  board.every((row, rowIndex) =>
    row.every((value, colIndex) => value === solution[rowIndex][colIndex])
  );

const sanitizeName = (value) => {
  const raw = (value ?? '').toString().trim();
  return raw.slice(0, 20) || 'Player';
};

const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  do {
    code = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  } while (rooms.has(code));
  return code;
};

const serializeRoom = (room) => ({
  roomCode: room.id,
  hostId: room.hostId,
  difficulty: room.difficulty,
  status: room.status,
  maxPlayers: room.maxPlayers,
  players: [...room.players.values()].map((player) => ({
    id: player.id,
    name: player.name,
    ready: player.ready,
    isHost: player.id === room.hostId,
    connected: player.connected,
  })),
  startedAt: room.startedAt,
  leaderboard: room.leaderboard,
  allReady: room.players.size > 0 && [...room.players.values()].every((player) => player.ready),
});

const roomExists = (roomCode) => rooms.has(roomCode);

const getRoomBySocket = (socket) => {
  const roomCode = socket.data.roomCode;
  if (!roomCode) return null;
  return rooms.get(roomCode) || null;
};

const emitRoomUpdate = (room) => {
  io.to(room.id).emit('room:update', serializeRoom(room));
};

const resetPlayerBoard = (player, puzzle) => {
  player.board = cloneBoard(puzzle);
  player.finished = false;
  player.finishTime = null;
  player.score = 0;
};

const finishPlayer = (room, player) => {
  if (player.finished) return;

  player.finished = true;
  player.finishTime = Date.now();

  const rank = room.leaderboard.length + 1;
  const firstFinishMs = room.firstFinishMs ?? player.finishTime;
  if (!room.firstFinishMs) {
    room.firstFinishMs = firstFinishMs;
  }

  const maxScore = 100 - 5 * (rank - 1);
  const minScore = 100 - 20 * (rank - 1);
  const deltaMs = Math.max(0, player.finishTime - room.firstFinishMs);
  const deltaSeconds = deltaMs / 1000;
  const finalScore = calculateScore(rank, room.firstFinishMs, player.finishTime, maxScore, minScore, deltaSeconds);

  player.score = finalScore;

  room.leaderboard.push({
    playerId: player.id,
    name: player.name,
    rank,
    score: finalScore,
    finishTime: player.finishTime,
    deltaSeconds,
  });

  room.leaderboard.sort((a, b) => a.rank - b.rank); 

  io.to(room.id).emit('game:leaderboard', {
    leaderboard: room.leaderboard,
    roomCode: room.id,
  });

  const allFinished = [...room.players.values()].every((entry) => entry.finished);
  if (allFinished) {
    room.status = 'leaderboard';
    io.to(room.id).emit('game:over', {
      leaderboard: room.leaderboard,
      roomCode: room.id,
    });
  }
};

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'Online Sudoku backend is running.' });
});

io.on('connection', (socket) => {
  socket.on('room:create', ({ playerName }) => {
    const safeName = sanitizeName(playerName);
    const roomCode = generateRoomCode();
    const room = {
      id: roomCode,
      hostId: socket.id,
      status: 'lobby',
      maxPlayers: MAX_PLAYERS,
      difficulty: 'easy',
      players: new Map(),
      leaderboard: [],
      firstFinishMs: null,
      startedAt: null,
      puzzle: null,
      solution: null,
    };

    const player = {
      id: socket.id,
      name: safeName,
      ready: false,
      connected: true,
      board: createEmptyBoard(),
      finished: false,
      finishTime: null,
      score: 0,
    };

    room.players.set(socket.id, player);
    rooms.set(roomCode, room);
    socket.data.roomCode = roomCode;
    socket.join(roomCode);

    socket.emit('room:joined', { room: serializeRoom(room), playerId: socket.id });
    emitRoomUpdate(room);
  });

  socket.on('room:join', ({ roomCode, playerName }) => {
    const code = (roomCode || '').toString().toUpperCase();
    const room = rooms.get(code);

    if (!room) {
      socket.emit('error', { message: 'Invalid room code. Please check the code and try again.' });
      return;
    }

    if (room.status !== 'lobby') {
      socket.emit('error', { message: 'This room is already in progress.' });
      return;
    }

    if (room.players.size >= room.maxPlayers) {
      socket.emit('error', { message: 'This room is full.' });
      return;
    }

    if (room.players.has(socket.id)) {
      socket.emit('error', { message: 'You are already in this room.' });
      return;
    }

    const player = {
      id: socket.id,
      name: sanitizeName(playerName),
      ready: false,
      connected: true,
      board: createEmptyBoard(),
      finished: false,
      finishTime: null,
      score: 0,
    };

    room.players.set(socket.id, player);
    socket.data.roomCode = code;
    socket.join(code);

    socket.emit('room:joined', { room: serializeRoom(room), playerId: socket.id });
    emitRoomUpdate(room);
  });

  socket.on('room:toggle-ready', () => {
    const room = getRoomBySocket(socket);
    if (!room) {
      socket.emit('error', { message: 'You are not in a room.' });
      return;
    }

    const player = room.players.get(socket.id);
    if (!player) {
      socket.emit('error', { message: 'Player not found in room.' });
      return;
    }

    player.ready = !player.ready;
    emitRoomUpdate(room);
  });

  socket.on('room:set-difficulty', ({ difficulty }) => {
    const room = getRoomBySocket(socket);
    if (!room) {
      socket.emit('error', { message: 'You are not in a room.' });
      return;
    }

    if (room.hostId !== socket.id) {
      socket.emit('error', { message: 'Only the host can change the game difficulty.' });
      return;
    }

    const nextDifficulty = difficulty || 'easy';
    if (!(nextDifficulty in DIFFICULTY_SETTINGS)) {
      socket.emit('error', { message: 'Invalid difficulty value.' });
      return;
    }

    room.difficulty = nextDifficulty;
    emitRoomUpdate(room);
  });

  socket.on('game:start', () => {
    const room = getRoomBySocket(socket);
    if (!room) {
      socket.emit('error', { message: 'You are not in a room.' });
      return;
    }

    if (room.hostId !== socket.id) {
      socket.emit('error', { message: 'Only the host can start the game.' });
      return;
    }

    const players = [...room.players.values()];
    if (players.length < 1) {
      socket.emit('error', { message: 'At least one player is required to start.' });
      return;
    }

    if (!players.every((player) => player.ready)) {
      socket.emit('error', { message: 'All players must be ready before starting the game.' });
      return;
    }

    const { puzzle, solution } = generatePuzzle(room.difficulty);

    room.status = 'game';
    room.puzzle = puzzle;
    room.solution = solution;
    room.startedAt = Date.now();
    room.firstFinishMs = null;
    room.leaderboard = [];

    players.forEach((player) => {
      player.finished = false;
      player.finishTime = null;
      player.score = 0;
      resetPlayerBoard(player, puzzle);
    });

    io.to(room.id).emit('game:start', {
      roomCode: room.id,
      puzzle,
      difficulty: room.difficulty,
      startedAt: room.startedAt,
    });

    io.to(room.id).emit('room:update', serializeRoom(room));
  });

  socket.on('game:cell-attempt', ({ row, col, value }) => {
    const room = getRoomBySocket(socket);
    if (!room) {
      socket.emit('error', { message: 'Room not found.' });
      return;
    }

    if (room.status !== 'game') {
      socket.emit('error', { message: 'The game has not started yet.' });
      return;
    }

    const player = room.players.get(socket.id);
    if (!player) {
      socket.emit('error', { message: 'Player not found.' });
      return;
    }

    const parsedRow = Number(row);
    const parsedCol = Number(col);
    const parsedValue = Number(value);

    if (
      Number.isNaN(parsedRow) ||
      Number.isNaN(parsedCol) ||
      parsedRow < 0 || parsedRow > 8 ||
      parsedCol < 0 || parsedCol > 8
    ) {
      socket.emit('game:cell-result', { status: 'error', reason: 'Invalid board coordinates.' });
      return;
    }

    const move = Number.isNaN(parsedValue) ? 0 : parsedValue;
    const validation = validateMove(player.board, room.solution, parsedRow, parsedCol, move);

    if (!validation.ok) {
      socket.emit('game:cell-result', {
        status: 'error',
        row: parsedRow,
        col: parsedCol,
        value: move,
        reason: validation.reason,
      });
      return;
    }

    if (move === 0) {
      player.board[parsedRow][parsedCol] = 0;
      socket.emit('game:cell-result', {
        status: 'success',
        row: parsedRow,
        col: parsedCol,
        value: 0,
        board: player.board,
      });
      return;
    }

    player.board[parsedRow][parsedCol] = move;
    socket.emit('game:cell-result', {
      status: 'success',
      row: parsedRow,
      col: parsedCol,
      value: move,
      board: player.board,
    });

    if (allCellsMatch(player.board, room.solution)) {
      finishPlayer(room, player);
    }
  });

  socket.on('disconnect', () => {
    const roomCode = socket.data.roomCode;
    if (!roomCode) return;

    const room = rooms.get(roomCode);
    if (!room) return;

    const disconnectedPlayer = room.players.get(socket.id);
    if (disconnectedPlayer) {
      room.players.delete(socket.id);
    }

    if (room.players.size === 0) {
      rooms.delete(roomCode);
      return;
    }

    if (room.hostId === socket.id) {
      const [nextHost] = [...room.players.values()];
      if (nextHost) {
        room.hostId = nextHost.id;
        nextHost.ready = true;
      }
    }

    if (room.status === 'lobby') {
      emitRoomUpdate(room);
      return;
    }

    const remainingPlayers = [...room.players.values()];
    if (remainingPlayers.length === 0) {
      rooms.delete(roomCode);
      return;
    }

    if (remainingPlayers.every((player) => player.finished)) {
      room.status = 'leaderboard';
      io.to(room.id).emit('game:over', { leaderboard: room.leaderboard, roomCode: room.id });
    }

    emitRoomUpdate(room);
  });
});

server.listen(PORT, () => {
  console.log(`Online Sudoku server running on http://localhost:${PORT}`);
});
