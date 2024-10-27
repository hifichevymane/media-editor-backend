import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import chalk from 'chalk';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import bodyParser from 'body-parser';

import logger from './logger';
import connectDatabase from './database/connectDatabase';

import audioRouter from './routers/audio/router';
import authRouter from './routers/auth/router';

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
} else {
  throw new Error('No ffmpeg path was found')
}

const PORT = process.env.APP_PORT || 8000;
const FRONTEND_URL = process.env.FRONTEND_URL || `http://localhost:5173`;

const app = express();

const corsOptions = {
  origin: FRONTEND_URL,
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions));

app.use(logger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use('/audio', audioRouter);
app.use('/auth', authRouter);

app.get('/', (req: Request, res: Response) => {
  res.json({ status: 200, message: 'the app works!' });
});

connectDatabase();
app.listen(PORT, () => {
  console.log(chalk.green(`Server is running on port ${PORT}`));
});
