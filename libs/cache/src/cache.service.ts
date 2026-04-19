import { Injectable } from '@nestjs/common';
import { Redis } from '@upstash/redis';

@Injectable()
export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }

  /**
   * 🔥 Set value with TTL (ms → seconds)
   */
  async set<TValue>(key: string, value: TValue, ttlMs = 60_000): Promise<void> {
    try {
      const ttlSeconds = Math.floor(ttlMs / 1000);
      await this.redis.set(key, value, { ex: ttlSeconds });
    } catch (err) {
      console.error('Cache SET error:', err);
    }
  }

  /**
   * 🔥 Get value
   */
  async get<TValue>(key: string): Promise<TValue | null> {
    try {
      const value = await this.redis.get<TValue>(key);
      return value ?? null;
    } catch (err) {
      console.error('Cache GET error:', err);
      return null;
    }
  }

  /**
   * 🔥 Wrap (cache-aside pattern)
   */
  async wrap<TValue>(
    key: string,
    producer: () => Promise<TValue>,
    ttlMs = 60_000,
  ): Promise<TValue> {
    const cached = await this.get<TValue>(key);

    if (cached !== null) {
      console.log('⚡ CACHE HIT:', key);
      return cached;
    }

    console.log('🐢 CACHE MISS:', key);

    const value = await producer();

    // Optional: don't cache empty results
    if (value !== null && value !== undefined) {
      await this.set(key, value, ttlMs);
    }

    return value;
  }

  /**
   * 🔥 Clear all cache (careful in prod)
   */
  async clear(): Promise<void> {
    try {
      await this.redis.flushall();
    } catch (err) {
      console.error('Cache CLEAR error:', err);
    }
  }
}