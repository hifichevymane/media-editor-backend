import 'dotenv/config';
import express, { Request, Response } from 'express';
import chalk from 'chalk';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

import logger from './logger';

import audioRouter from './routers/audio';

if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
} else {
  throw new Error('No ffmpeg path was found')
}

const PORT = process.env.PORT || 8000;
const app = express();
app.use(logger);
app.use('/audio', audioRouter);

app.get('/', (req: Request, res: Response) => {
  res.json({ status: 200, message: 'the app works!' });
});

app.listen(PORT, () => {
  console.log(chalk.green(`Server is running on port ${PORT}`));
});