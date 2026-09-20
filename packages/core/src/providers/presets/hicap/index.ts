import type { GatewayProviderConfig } from "@ccr/core/contracts/app";
import { defaultProviderAccountConfig, type ProviderPreset } from "@ccr/core/providers/presets/types";

export const hicapApiKeyEnvVar = "HICAP_API_KEY";

export const hicapAuthHeaderName = "api-key";

export const hicapApiHostname = "api.hicap.ai";

export const hicapApiBaseUrl = "https://api.hicap.ai/v1";

export const hicapProviderPreset: ProviderPreset = {
  account: defaultProviderAccountConfig,
  aliases: ["hicap", "hicap.ai", "hicap ai"],
  defaultModels: [
    "claude-opus-4.5",
    "claude-sonnet-4.5",
    "claude-haiku-4.5",
    "gpt-5.2",
    "gpt-5.1",
    "gemini-3-pro-preview",
    "gemini-3-flash-preview"
  ],
  endpoints: [
    {
      baseUrl: hicapApiBaseUrl,
      protocols: ["openai_chat_completions"]
    }
  ],
  id: "hicap",
  name: "Hicap",
  websiteUrl: "https://hicap.ai/"
};

/**
 * Hicap ships enabled out of the box so a fresh install only needs
 * `HICAP_API_KEY` exported in the environment. The API key stays a `${...}`
 * placeholder so no credential is ever written into the default config file.
 */
export function createHicapDefaultProviderConfig(): GatewayProviderConfig {
  return {
    api_base_url: `${hicapApiBaseUrl}/chat/completions`,
    api_key: `\${${hicapApiKeyEnvVar}}`,
    enabled: true,
    models: [...(hicapProviderPreset.defaultModels ?? [])],
    name: hicapProviderPreset.id,
    type: "openai_chat_completions"
  };
}
