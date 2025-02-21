import { Request, Response, NextFunction } from 'express';

import Logger from '../lib/logger';
interface ResponseWithStartTime extends Response {
    startTime?: number;
  };

  export const requestLogger = (
    req: Request, 
    res: ResponseWithStartTime, 
    next: NextFunction
  ) => {
    res.startTime = Date.now();
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    Logger.http({
      message: 'Incoming request',
      requestId,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      body: req.method !== 'GET' ? req.body : undefined,
      query: Object.keys(req.query).length ? req.query : undefined,
    });
  
    res.on('finish', () => {
      const responseTime = Date.now() - (res.startTime || Date.now());
      
      Logger.http({
        message: 'Request completed',
        requestId,
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        contentLength: res.get('content-length'),
      });
    });
  
    (req as any).requestId = requestId;
    next();
  };