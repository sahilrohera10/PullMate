import { EnvironmentConfig } from '../types/logger.type';


export const getEnvironmentConfig = (): EnvironmentConfig => {
    switch (process.env.NODE_ENV) {
      case 'production':
        return {
          level: 'info',
          silent: false,
          maxFiles: '30d',
          maxSize: '50m'
        };
      case 'staging':
        return {
          level: 'debug',
          silent: false,
          maxFiles: '14d',
          maxSize: '20m'
        };
      case 'development':
      default:
        return {
          level: 'debug',
          silent: false,
          maxFiles: '7d',
          maxSize: '10m'
        };
    }
  };
  
