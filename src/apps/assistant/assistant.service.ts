import { Injectable } from '@nestjs/common';

import { AiQueryDto } from '../ai/dto/ai-query.dto';
import { AssistantOrchestrator, AssistantSearchResponse } from './assistant.orchestrator';

@Injectable()
export class AssistantService {
  public constructor(private readonly assistantOrchestrator: AssistantOrchestrator) {}

  public searchWithPrompt(dto: AiQueryDto): Promise<AssistantSearchResponse> {
    return this.assistantOrchestrator.handlePrompt(dto);
  }
}
