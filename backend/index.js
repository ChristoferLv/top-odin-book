import 'dotenv/config';
import express, { json, urlencoded } from "express";
import { passport } from "./authUtils.js";
import authRouter from "./routes/authRoutes.js";
import { prisma } from "./lib/prisma.js";
import cors from 'cors'
import jwt from 'jsonwebtoken';
import userRoutes from './routes/userRoutes.js';
import postRouter from './routes/postRoutes.js';
import notificationRouter from './routes/notificationRoutes.js';


const app = express();

const corsOptions = {
  origin: 'http://localhost:5173'
};

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors(corsOptions));

app.use((req, res, next) => {
  try {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url || req.originalUrl || 'unknown';
    console.log(`📝 ${timestamp} - ${method} ${url}`);
    console.log("   └req.body ->", req.body)
    //console.log(req.headers.cookie)

    const originalJson = res.json.bind(res)
    res.json = (body) => {
      if (!req.originalUrl.includes("picture") && !req.originalUrl.includes("background") && !req.originalUrl.includes("midia"))
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
app.use("/users", userRoutes);
app.use("/notifications", notificationRouter);
app.use("/auth", authRouter);
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


app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
  console.log("http://localhost:3000");
});

