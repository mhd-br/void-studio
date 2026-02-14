# Void Studio

A real-time collaborative design tool with custom GLSL shaders.

## Features

- 🎨 Multiple shape tools (rectangles, circles, stars, text, images)
- ✨ Custom GLSL shader editor
- 🤝 Real-time collaboration with WebSockets
- 💾 Project save/load with localStorage
- ↩️ Undo/Redo system
- 🎭 23+ shader presets
- 🖼️ Image import
- 📤 Export to PNG (1x, 2x, 4x)

## Project Structure
```
void-studio/
├── client/     # React + Vite frontend
└── server/     # Express + Socket.io backend
```

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### Run Locally

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Open http://localhost:3000

## Deployment

See deployment guides for:
- [Vercel + Railway](#vercel--railway)
- [Render](#render)
- [Fly.io](#flyio)

## Tech Stack

**Frontend:**
- React 18
- Three.js + React Three Fiber
- Vite
- Zustand
- Monaco Editor
- Socket.io Client

**Backend:**
- Node.js + Express
- Socket.io
- CORS

## License

MIT
