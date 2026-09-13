import 'dotenv/config';
import express, { json, urlencoded } from "express";
import { passport } from "./authUtils.js";
import authRouter from "./routes/authRoutes.js";
import { prisma } from "./lib/prisma.js";
import cors from 'cors'
import jwt from 'jsonwebtoken';
import postRouter from './routes/postRoutes.js';
import notificationRouter from './routes/notificationRoutes.js';
import http from 'http'
import { Server } from 'socket.io'
import followRouter from './routes/followRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });

const corsOptions = {
  origin: 'http://localhost:5173'
};

app.use(urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(json());

app.use((req, res, next) => {
  req.socketIo = io;
  next();
})

app.use((req, res, next) => {
  try {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url || req.originalUrl || 'unknown';
    if (!req.originalUrl.includes("picture") && !req.originalUrl.includes("background") && !req.originalUrl.includes("midia")) {
      console.log(`📝 ${timestamp} - ${method} ${url}`);
      console.log("   └req.body ->", req.body)
    }
    //console.log(req.headers.cookie)

    const originalJson = res.json.bind(res)
    res.json = (body) => {
      if (!false && !req.originalUrl.includes("picture") && !req.originalUrl.includes("background") && !req.originalUrl.includes("midia"))
        console.log(`   └─ res [${res.statusCode}] ->`, JSON.stringify(body, null, 2), req.originalUrl, req.method)
      return originalJson(body)
    }
    next();
  } catch (error) {
    console.error("❌ Erro no middleware de log:", error);
    next(); // Continue mesmo com erro no log
  }
});

app.use("/posts", postRouter)
app.use("/users", userRouter);
app.use("/follows", followRouter);
app.use("/notifications", notificationRouter);
app.use("/auth", authRouter);
app.get("/socket", (req, res) => {
  console.log("emiting")
  io.emit("notification", "ALOOOOO!")
  res.send({ ok: true })
})

app.use("/", (req, res) => res.status(200).send({ message: "Ok" }))

app.use((err, req, res, next) => {
  console.log("******Global error midleware******")
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.status || 500;
  console.log(err)
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

io.on('connection', (socket) => {
  console.log('A user connected');
  let decoded = null;
  try {
    decoded = jwt.verify(socket.handshake.auth.token.split(" ")[1], process.env.JWT_SECRET);
  } catch (e) {
    console.log(e);
    return;
  }

  socket.user = { userId: decoded.id };
  socket.join(`user:${decoded.id}`);

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
  console.log("http://localhost:3000");
});

