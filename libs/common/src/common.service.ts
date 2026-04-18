import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  normalizeText(value: string): string {
    return value.trim().toLowerCase();
  }

  tokenize(value: string): string[] {
    const normalized = this.normalizeText(value);

    if (!normalized) {
      return [];
    }

    return normalized.split(/\s+/).filter(Boolean);
  }

  scoreTextMatch(query: string, target: string): number {
    const queryTokens = this.tokenize(query);

    if (queryTokens.length === 0) {
      return 0;
    }

    const targetNormalized = this.normalizeText(target);

    let score = 0;
    for (const token of queryTokens) {
      if (targetNormalized.includes(token)) {
        score += token.length;
      }
    }

    if (targetNormalized.startsWith(this.normalizeText(query))) {
      score += 5;
    }

    return score;
  }

  uniqueBy<T>(items: T[], keySelector: (item: T) => string): T[] {
    const seen = new Set<string>();
    const unique: T[] = [];

    for (const item of items) {
      const key = keySelector(item);
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    }

    return unique;
  }
}
