import pino from 'pino';
import { NODE_ENV, LOG_LEVEL } from './env.js';

// Check Node env
const isDev = NODE_ENV !== 'production';

// Configure pino logger
const logger = pino({
  level: LOG_LEVEL || 'info',

  ...(isDev && {
    // Set target to pino pretty if env==development
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname'
      }
    }
  })
});

export default logger;
