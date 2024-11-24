import winston from "winston";
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { getEnvironmentConfig } from "../config/environment.config";
import { levels, colors } from "../config/logger.config";
import { consoleFormat } from "../utils/logger.formats";

const envConfig = getEnvironmentConfig();
winston.addColors(colors);

const transports = [
    new winston.transports.Console({
        format: consoleFormat,
        level: envConfig.level,
        silent: envConfig.silent,
    }),

    new DailyRotateFile({
        filename: path.join(__dirname, '../../logs/all-logs-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.simple()  
        ),
        maxSize: envConfig.maxSize,
        maxFiles: envConfig.maxFiles,
    }),
];

const Logger = winston.createLogger({
    level: envConfig.level,
    levels,
    transports,
});

export default Logger;
