import pino from 'pino';
import { NODE_ENV ,LOG_LEVEL } from './env.js';

const isDev = NODE_ENV !== 'production';

const logger = pino({
    level : LOG_LEVEL || 'info',

    ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  }),
})

export default logger;