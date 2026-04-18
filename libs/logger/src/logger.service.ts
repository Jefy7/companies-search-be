import { Injectable } from '@nestjs/common';

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
    this.entries.push({
      level,
      message,
      context,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }
}
