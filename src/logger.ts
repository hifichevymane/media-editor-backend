import { createLogger, transports, format } from 'winston';
import { Request, Response, NextFunction } from 'express';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add a timestamp
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // Log to the console
    new transports.File({ filename: 'logs/app.log' }), // Log to a file
  ],
});

const middleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`); // Log HTTP method and URL
  next();
};

export default middleware;
