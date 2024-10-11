export default interface CropAudioBody {
  file: Express.Multer.File[],
  start_time: number,
  end_time: number
};
