import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import { ensureDefaultAdmin } from './utils/setupDefaultUser.js';
import { initSocket } from './serverSocket.js';

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://crm-f-five.vercel.app'
    : 'http://localhost:5173',
  credentials: true
}))

const PORT = process.env.PORT || 8000;

const start = async () => {
  await connectDB();
  await ensureDefaultAdmin();
  const server = http.createServer(app);

  initSocket(server);
  
  server.listen(PORT, () => {
    console.log(`SkyCRM backend listening on http://localhost:${PORT}`);
  });
};

start().catch(e => {
  console.error('Failed to start server', e);
  process.exit(1);
});
