import type { Request } from "express"

interface CropAudioBody {
  file: Express.Multer.File[],
  start_time: number,
  end_time: number
}

interface CropAudioRequest extends Request {
  body: CropAudioBody
};

export default CropAudioRequest;
