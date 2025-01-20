import express, { Express } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postsRoute from './routes/posts_route';
import commentsRoute from './routes/comments_route';

dotenv.config();

const initApp = async (): Promise<Express> => {
  const app = express();
  
  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Logging middleware
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  // Routes
  app.use('/posts', postsRoute);
  app.use('/comments', commentsRoute);

  // MongoDB connection
  const mongoUri = process.env.DB_CONNECT;
  if (!mongoUri) {
    throw new Error("DB_CONNECT is not defined in environment variables");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to database");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }

  return app;
};

export default initApp;