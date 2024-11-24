import { Request, Response, NextFunction } from 'express';
import Logger from '../lib/logger';

export const errorHandler = (
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  Logger.error({
    message: 'Unhandled error',
    requestId: (req as any).requestId,
    error: err.message,
    stack: err.stack,
    statusCode: statusCode,
  });
  
  res.status(statusCode).json({ error: err.message || 'Internal server error' });
};