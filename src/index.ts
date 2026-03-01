import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import analyzeRouter from './routes/analyze';
import historyRouter from './routes/history';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// FIX: CORS configuration ko exact mobile requirements ke hisaab se set kiya hai
const corsOptions = {
  origin: 'https://trueresume-frontend.vercel.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200 // Mobile browsers ke liye 200 return karna mandatory hai
};

app.use(cors(corsOptions));

// FIX: Explicitly handle OPTIONS requests for all routes (Mobile Preflight Fix)
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'TrueResume API' });
});

app.use('/api/analyze', analyzeRouter);
app.use('/api/history', historyRouter);

// FIX: Render environment variables ke liye '0.0.0.0' par listen karna zaroori hai
app.listen(PORT, '0.0.0.0', () => {
  console.log(`TrueResume API running on port ${PORT}`);
});

export default app;