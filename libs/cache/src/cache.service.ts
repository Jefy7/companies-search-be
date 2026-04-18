import { Injectable } from '@nestjs/common';

interface CacheEntry<TValue> {
  value: TValue;
  expiresAt: number;
}

@Injectable()
export class CacheService {
  private readonly store = new Map<string, CacheEntry<unknown>>();

  set<TValue>(key: string, value: TValue, ttlMs = 60_000): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  get<TValue>(key: string): TValue | null {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    if (entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value as TValue;
  }

  wrap<TValue>(key: string, producer: () => TValue, ttlMs = 60_000): TValue {
    const cached = this.get<TValue>(key);
    if (cached !== null) {
      return cached;
    }

    const value = producer();
    this.set(key, value, ttlMs);

    return value;
  }

  clear(): void {
    this.store.clear();
  }
}
