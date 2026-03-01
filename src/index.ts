import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import analyzeRouter from './routes/analyze';
import historyRouter from './routes/history';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://trueresume-frontend.vercel.app'
  ],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'TrueResume API' });
});

app.use('/api/analyze', analyzeRouter);
app.use('/api/history', historyRouter);

app.listen(PORT, () => {
  console.log(`TrueResume API running on port ${PORT}`);
});

export default app;
