import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import analyzeRouter from './routes/analyze';
import historyRouter from './routes/history';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
