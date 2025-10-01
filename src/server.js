import dotenv from "dotenv";
dotenv.config();
import http from "http";
import cors from "cors";
import app from "./app.js";
import connectDB from "./config/db.js";
import { ensureDefaultAdmin } from "./utils/setupDefaultUser.js";
import { initSocket } from "./serverSocket.js";

// ✅ CORS config
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://crm-f-five.vercel.app"
        : "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Root route (so Render doesn’t return 404 at /)
app.get("/", (req, res) => {
  res.send("🚀 SkyCRM Backend is running successfully!");
});

const PORT = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDB();
    await ensureDefaultAdmin();

    const server = http.createServer(app);

    // ✅ Initialize WebSocket/Socket.IO
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`SkyCRM backend listening on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error("❌ Failed to start server", e);
    process.exit(1);
  }
};

start();

// import dotenv from 'dotenv';
// dotenv.config();
// import http from 'http';
// import cors from 'cors';
// import app from './app.js';
// import connectDB from './config/db.js';
// import { ensureDefaultAdmin } from './utils/setupDefaultUser.js';
// import { initSocket } from './serverSocket.js';

// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' 
//     ? 'https://crm-f-five.vercel.app'
//     : 'http://localhost:5173',
//   credentials: true
// }))

// const PORT = process.env.PORT || 8000;

// const start = async () => {
//   await connectDB();
//   await ensureDefaultAdmin();
//   const server = http.createServer(app);

//   initSocket(server);
  
//   server.listen(PORT, () => {
//     console.log(`SkyCRM backend listening on http://localhost:${PORT}`);
//   });
// };

// start().catch(e => {
//   console.error('Failed to start server', e);
//   process.exit(1);
// });
