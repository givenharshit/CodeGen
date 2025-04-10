import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import geminiRoutes from './routes/gemini.routes.js';

const app = express(); // appHandler

app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    })
  );
app.use(morgan('dev'));
app.use(express.json({limit: "8kb"}));
app.use(express.urlencoded({ extended: true, limit: "8kb" }));
app.use(express.static('public'));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/gemini', geminiRoutes);

app.use('/', (_, res) => {
  res.status(200).json({ message: 'Welcome to the Gemini API!' });
});

export default app;