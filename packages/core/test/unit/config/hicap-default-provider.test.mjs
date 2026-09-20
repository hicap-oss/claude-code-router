import assert from "node:assert/strict";
import test from "node:test";
import { createDefaultAppConfig, DEFAULT_PROXY_TARGETS } from "@ccr/core/config/default-config.ts";
import {
  createHicapDefaultProviderConfig,
  hicapApiBaseUrl,
  hicapApiHostname,
  hicapApiKeyEnvVar,
  hicapAuthHeaderName,
  hicapProviderPreset
} from "@ccr/core/providers/presets/hicap/index.ts";
import { findProviderPresetByBaseUrl, providerPresets } from "@ccr/core/providers/presets/index.ts";
import { findProviderPresetByIdentityInList } from "@ccr/core/providers/presets/utils.ts";

test("Hicap preset describes an OpenAI-compatible endpoint on the official base URL", () => {
  assert.equal(hicapApiBaseUrl, "https://api.hicap.ai/v1");
  assert.equal(hicapApiHostname, "api.hicap.ai");
  assert.equal(hicapAuthHeaderName, "api-key");
  assert.equal(hicapApiKeyEnvVar, "HICAP_API_KEY");
  assert.deepEqual(hicapProviderPreset.endpoints, [
    { baseUrl: hicapApiBaseUrl, protocols: ["openai_chat_completions"] }
  ]);
});

test("Hicap preset is registered and resolvable by identity and base URL", () => {
  assert.ok(providerPresets.some((preset) => preset.id === "hicap"));
  for (const identity of ["hicap", "Hicap", "hicap.ai"]) {
    assert.equal(findProviderPresetByIdentityInList(providerPresets, identity)?.id, "hicap");
  }
  assert.equal(findProviderPresetByBaseUrl(`${hicapApiBaseUrl}/chat/completions`)?.id, "hicap");
});

test("Hicap is configured by default without embedding a credential", () => {
  const provider = createDefaultAppConfig().Providers.find((entry) => entry.name === "hicap");
  assert.ok(provider, "expected a default Hicap provider entry");
  assert.equal(provider.api_base_url, `${hicapApiBaseUrl}/chat/completions`);
  assert.equal(provider.api_key, `\${${hicapApiKeyEnvVar}}`);
  assert.equal(provider.type, "openai_chat_completions");
  assert.equal(provider.enabled, true);
  assert.deepEqual(provider.models, hicapProviderPreset.defaultModels);
});

test("Hicap default provider config is not shared between callers", () => {
  const first = createHicapDefaultProviderConfig();
  const second = createHicapDefaultProviderConfig();
  assert.notEqual(first, second);
  assert.notEqual(first.models, second.models);
  assert.notEqual(first.models, hicapProviderPreset.defaultModels);
  first.models.push("mutated-model");
  assert.deepEqual(second.models, hicapProviderPreset.defaultModels);
});

test("Hicap is reachable through the default proxy targets", () => {
  const target = DEFAULT_PROXY_TARGETS.find((entry) => entry.host === hicapApiHostname);
  assert.ok(target, "expected a default proxy target for Hicap");
  assert.ok(target.paths.includes("/v1/chat/completions"));
});
