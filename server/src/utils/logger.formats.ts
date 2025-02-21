import winston from "winston";
import moment from "moment-timezone";


export const consoleFormat = winston.format.combine(
  winston.format.timestamp({ 
    format: () => moment().tz('Asia/Kolkata').format('YYYY-MM-DD hh:mm:ss A')
   }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
);
