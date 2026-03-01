import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import analyzeRouter from './routes/analyze';
import historyRouter from './routes/history';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({
  origin: 'https://trueresume-frontend.vercel.app', // Specific origin dena best hai
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // Mobile browsers ke liye 204 ki jagah 200 zaroori hai
}));

app.options('*', cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'TrueResume API' });
});

app.use('/api/analyze', analyzeRouter);
app.use('/api/history', historyRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`TrueResume API running on port ${PORT}`);
});

export default app;
