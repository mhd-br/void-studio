const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Vite dev server
    methods: ["GET", "POST"]
  }
});

// Store active rooms and their state
const rooms = new Map();

// Store users in each room
const roomUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Join a project room
  socket.on('join-room', ({ roomId, user }) => {
    socket.join(roomId);
    
    // Add user to room
    if (!roomUsers.has(roomId)) {
      roomUsers.set(roomId, new Map());
    }
    
    roomUsers.get(roomId).set(socket.id, {
      id: socket.id,
      name: user.name || 'Anonymous',
      color: user.color || '#4a9eff',
      cursor: { x: 0, y: 0 }
    });
    
    console.log(`User ${socket.id} joined room ${roomId}`);
    
    // Send current room state to new user
    const roomState = rooms.get(roomId);
    if (roomState) {
      socket.emit('room-state', roomState);
    }
    
    // Broadcast user list to room
    const users = Array.from(roomUsers.get(roomId).values());
    io.to(roomId).emit('users-update', users);
  });
  
  // Canvas state update
  socket.on('canvas-update', ({ roomId, state }) => {
    // Store room state
    rooms.set(roomId, state);
    
    // Broadcast to other users in room
    socket.to(roomId).emit('canvas-update', {
      state,
      userId: socket.id
    });
  });
  
  // Cursor position update
  socket.on('cursor-move', ({ roomId, position }) => {
    const room = roomUsers.get(roomId);
    if (room && room.has(socket.id)) {
      const user = room.get(socket.id);
      user.cursor = position;
      
      // Broadcast to other users in room
      socket.to(roomId).emit('cursor-update', {
        userId: socket.id,
        user: user
      });
    }
  });
  
  // Layer operation (add, update, delete)
  socket.on('layer-operation', ({ roomId, operation }) => {
    // Broadcast operation to other users
    socket.to(roomId).emit('layer-operation', {
      operation,
      userId: socket.id
    });
  });
  
  // Void config update
  socket.on('void-update', ({ roomId, voidConfig }) => {
    // Broadcast to other users in room
    socket.to(roomId).emit('void-update', {
      voidConfig,
      userId: socket.id
    });
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove user from all rooms
    roomUsers.forEach((room, roomId) => {
      if (room.has(socket.id)) {
        room.delete(socket.id);
        
        // Broadcast updated user list
        const users = Array.from(room.values());
        io.to(roomId).emit('users-update', users);
      }
    });
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Void Studio Server running on port ${PORT}`);
});