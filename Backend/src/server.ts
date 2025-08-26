// server.ts
import app, { setupSocket, getSocketInstance } from './app';
import { createServer } from 'http';

const PORT = process.env.PORT || 5000;

const server = createServer(app);
const io = setupSocket(server); 
app.set('io', io);

console.log('[server.ts] Socket.IO instance initialized:', !!getSocketInstance());

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export { io };