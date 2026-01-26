---
title: "How to Set Up Claude Code Router with Hicap"
date: "2026-01-26"
author: "Hicap Engineering"
description: "A step-by-step guide for Hicap customers to integrate Claude Code Router with the Hicap API."
---

# Setting Up Claude Code Router with Hicap

Welcome, Hicap customers! This guide will walk you through configuring the [Claude Code Router](https://github.com/anthropics/claude-code) to work seamlessly with the Hicap API for multi-model, multi-provider AI development.

## Prerequisites
- Node.js and pnpm installed
- Access to the Claude Code Router repository
- Your Hicap API key

## 1. Install Claude Code Router
Install the official npm package:

```sh
# Using pnpm (recommended)
$ pnpm add -g @hicap-ai/claude-code-router

# Or using npm
$ npm install -g @hicap-ai/claude-code-router
```

This will install the `ccr` CLI globally. You do not need to clone the repo or build from source.

## 2. Configure Hicap as a Provider
Edit your `~/.claude-code-router/config.json` (or the config for your deployment). Here’s a minimal working example:

```json
{
  "LOG": true,
  "LOG_LEVEL": "debug",
  "HOST": "127.0.0.1",
  "PORT": 3456,
  "APIKEY": "<your_hicap_api_key>",
  "API_TIMEOUT_MS": "600000",
  "transformers": [
    { "path": "C:/Users/<your-user>/.claude-code-router/hicap-transformer.js" }
  ],
  "Providers": [
    {
      "name": "hicap",
      "api_base_url": "https://api.hicap.ai/v1/chat/completions",
      "api_key": "<your_hicap_api_key>",
      "models": [
        "claude-opus-4.5",
        "claude-opus-4.1",
        "claude-opus-4",
        "claude-sonnet-4.5",
        "claude-sonnet-4",
        "claude-haiku-4.5",
        "gpt-5.2",
        "gpt-5.1",
        "gpt-5",
        "gpt-5-mini",
        "gpt-4o",
        "gemini-2.5-pro",
        "gemini-2.5-flash"
      ],
      "transformer": { "use": ["hicap"] }
    }
  ],
  "Router": {
    "default": "hicap,claude-sonnet-4.5",
    "background": "hicap,claude-sonnet-4.5",
    "think": "hicap,claude-sonnet-4.5",
    "longContext": "hicap,claude-sonnet-4.5",
    "longContextThreshold": 60000,
    "webSearch": "hicap,claude-sonnet-4.5",
    "image": ""
  }
}
```

- Replace `<your_hicap_api_key>` and `<your-user>` with your actual values.
- The `transformers` array points to your local `hicap-transformer.js`.

## 3. Minimal Hicap Transformer
Place this file at `~/.claude-code-router/hicap-transformer.js`:

```js
module.exports = class HicapTransformer {
  static name = 'hicap';
  name = 'hicap';

  async transformRequestIn(request, provider, context) {
    return {
      body: request,
      config: {
        headers: {
          'api-key': provider.apiKey,
          'Authorization': undefined,
          'authorization': undefined
        }
      }
    };
  }

  async auth(request, provider, context) {
    return {
      body: request,
      config: {
        headers: {
          'api-key': provider.apiKey,
          'Authorization': undefined,
          'authorization': undefined
        }
      }
    };
  }

  async transformResponseOut(response) {
    return response;
  }
};
```

- This transformer simply injects your Hicap API key into every request.
- No model-specific or "thinking" logic is needed—Claude Code Router and Hicap handle all model routing and features natively.

## 4. Start the Router

Start the router with:

```sh
$ ccr start
```

Or, for one-off commands:

```sh
$ npx @hicap-ai/claude-code-router start
```

## 5. Test Your Setup
Try a simple chat or code completion request using the Hicap provider and any supported model (e.g., `claude-opus-4.5`).

If you see responses and no API errors, you’re ready to go!

---

**Questions?**
Reach out to Hicap support or open an issue in your Claude Code Router deployment repo.

Happy building!

— Hicap Engineering
