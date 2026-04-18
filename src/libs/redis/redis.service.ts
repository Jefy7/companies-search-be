import { Injectable, Optional } from '@nestjs/common';
import { AppLogger } from '../logger/app.logger';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly logger = new AppLogger(RedisService.name);

  public constructor(@Optional() private readonly client?: Redis) {}

  public async get<T>(key: string): Promise<T | null> {
    if (!this.client) {
      return null;
    }
    const cached = await this.client.get(key);
    if (!cached) {
      this.logger.debug(`cache miss: ${key}`);
      return null;
    }
    this.logger.debug(`cache hit: ${key}`);
    return JSON.parse(cached) as T;
  }

  public async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    if (!this.client) {
      return;
    }
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }
}
