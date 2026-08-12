import { Injectable, LoggerService } from '@nestjs/common';
import pino, { type Logger } from 'pino';

@Injectable()
export class PinoLogger implements LoggerService {
  private logger: Logger;
  private context?: string;

  constructor() {
    this.logger = pino({
      level: process.env.LOG_LEVEL || 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      },
    });
  }

  private getLogger(context?: string): Logger {
    const ctx = context || this.context;
    if (ctx) {
      return this.logger.child({ ctx });
    }
    return this.logger;
  }

  log(message: string, context?: string) {
    this.getLogger(context).info(message);
  }

  error(message: string, trace?: string, context?: string) {
    this.getLogger(context).error({ trace }, message);
  }

  warn(message: string, context?: string) {
    this.getLogger(context).warn(message);
  }

  debug(message: string, context?: string) {
    this.getLogger(context).debug(message);
  }

  verbose(message: string, context?: string) {
    this.getLogger(context).trace(message);
  }

  setContext(context: string) {
    this.context = context;
  }
}
