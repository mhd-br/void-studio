# Void Studio

A real-time collaborative design tool with custom GLSL shaders.

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


## License

MIT
