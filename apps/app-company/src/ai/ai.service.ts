import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { LoggerService } from '@lib/logger';
import { AiSearchResponseDto } from './ai-search.dto';

export interface AiSearchResult {
  filters: {
    sector?: string;
    subSector?: string;
    location?: string;
    tags?: string[];
  };
  similarTerms: string[];
  suggestions: string[];
  confidence: number;
}

@Injectable()
export class AiService {
  private static readonly TIMEOUT_MS = 15000;

  constructor(private readonly loggerService: LoggerService) { }

  async enhanceSearch(query: string): Promise<AiSearchResult | null> {
    const endpoint = process.env.AI_SEARCH_ENDPOINT ?? 'http://localhost:8000/api/v1/ai/search';

    const startedAt = Date.now();
    let attempt = 0;

    while (attempt < 2) {
      attempt += 1;

      try {
        const response = await this.postWithTimeout(endpoint, { query });
        const latencyMs = Date.now() - startedAt;
        const validated = this.validateAiResponse(response);

        if (!validated) {
          this.loggerService.warn('AI response validation failed', 'AiService', {
            query,
            latencyMs,
            attempt,
          });
          return null;
        }

        this.loggerService.info('AI search response received', 'AiService', {
          query,
          latencyMs,
          attempt,
          confidence: validated.confidence,
        });

        return validated;
      } catch (error) {
        const latencyMs = Date.now() - startedAt;
        this.loggerService.warn('AI search call failed', 'AiService', {
          query,
          latencyMs,
          attempt,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return null;
  }

  private async postWithTimeout(
    endpoint: string,
    payload: Record<string, string>,
  ): Promise<unknown> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AiService.TIMEOUT_MS);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`FastAPI returned status ${response.status}`);
      }

      return response.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  private validateAiResponse(payload: unknown): AiSearchResult | null {
    const dto = plainToInstance(AiSearchResponseDto, payload);
    const errors = validateSync(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      return null;
    }

    return {
      filters: {
        sector: dto.filters?.sector,
        location: dto.filters?.location,
        tags: dto.filters?.tags ?? [],
      },
      similarTerms: dto.similarTerms ?? [],
      suggestions: dto.suggestions ?? [],
      confidence: dto.confidence,
    };
  }
}
