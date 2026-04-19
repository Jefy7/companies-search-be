import { Injectable, Logger } from '@nestjs/common';

export interface LogEntry {
  level: 'info' | 'warn' | 'error';
  message: string;
  context?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

@Injectable()
export class LoggerService {
  private readonly entries: LogEntry[] = [];
  private readonly logger = new Logger(); // ✅ NestJS Logger

  info(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.push('info', message, context, metadata);
  }

  warn(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.push('warn', message, context, metadata);
  }

  error(message: string, context?: string, metadata?: Record<string, unknown>): void {
    this.push('error', message, context, metadata);
  }

  getEntries(): LogEntry[] {
    return [...this.entries];
  }

  clear(): void {
    this.entries.length = 0;
  }

  private push(
    level: LogEntry['level'],
    message: string,
    context?: string,
    metadata?: Record<string, unknown>,
  ): void {
    const log: LogEntry = {
      level,
      message,
      context,
      metadata,
      timestamp: new Date().toISOString(),
    };

    this.entries.push(log);

    // ✅ Structured log message
    const formattedMessage = `${message} ${metadata ? JSON.stringify(metadata) : ''
      }`;

    // ✅ Use NestJS Logger internally
    switch (level) {
      case 'error':
        this.logger.error(formattedMessage, undefined, context);
        break;
      case 'warn':
        this.logger.warn(formattedMessage, context);
        break;
      default:
        this.logger.log(formattedMessage, context);
    }
  }
}