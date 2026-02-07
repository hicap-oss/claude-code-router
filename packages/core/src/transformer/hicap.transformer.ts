/**
 * Hicap Transformer
 * Transforms requests for the Hicap API provider
 * Uses api-key header instead of Authorization for authentication
 */

import { Transformer, TransformerContext } from "@/types/transformer";
import { LLMProvider, UnifiedChatRequest } from "@/types/llm";

export class HicapTransformer implements Transformer {
  static TransformerName = "hicap";
  name = "hicap";

  async transformRequestIn(
    request: UnifiedChatRequest,
    provider: LLMProvider,
    context: TransformerContext
  ): Promise<Record<string, any>> {
    return {
      body: request,
      config: {
        headers: {
          "api-key": provider.apiKey,
          Authorization: undefined,
          authorization: undefined,
        },
      },
    };
  }

  async auth(
    request: any,
    provider: LLMProvider,
    context: TransformerContext
  ): Promise<any> {
    return {
      body: request,
      config: {
        headers: {
          "api-key": provider.apiKey,
          Authorization: undefined,
          authorization: undefined,
        },
      },
    };
  }

  async transformResponseOut(response: Response): Promise<Response> {
    return response;
  }
}
