import fs from 'fs';
import path from 'path';
import { Router } from "express";
import type { Request, Response } from "express";
import ffmpeg from 'fluent-ffmpeg';

import upload, { uploadDir } from '../upload';

import CropAudioBody from '../interfaces/CropAudioBody';

const router = Router();

router.post('/crop-audio', upload.single('file'), (req: Request, res: Response) => {
  const { start_time: startTime, end_time: endTime }: CropAudioBody = req.body;
  const inputFilePath = req.file?.path;
  const outputFilePath = path.join(uploadDir, `cropped-${req.file?.filename}`);

  if (!inputFilePath || !startTime || !endTime) {
    res
      .status(400)
      .json({ error: 'Invalid request parameters' });
    return;
  }

  ffmpeg(inputFilePath)
    .setStartTime(startTime)
    .setDuration(endTime - startTime)
    .output(outputFilePath)
    .on('end', () => {
      res.download(outputFilePath, (err) => {
        if (err) {
          console.error('Error during file download:', err);
          res
            .status(500)
            .json({ error: 'File download error' });
        }
        // Optionally, remove the cropped file after download
        fs.unlink(outputFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting cropped file:', unlinkErr);
          }
        });
      });
    })
    .on('error', (err) => {
      console.error('Error during audio cropping:', err);
      res
        .status(500)
        .json({ error: 'Error during audio cropping' });
    })
    .run();
});

export default router;
