---
title: "How to Set Up Claude Code Router with Hicap"
date: "2026-01-26"
author: "Hicap Engineering"
description: "A step-by-step guide for Hicap customers to integrate Claude Code Router with the Hicap API."
---

# Setting Up Claude Code Router with Hicap

This guide walks you through configuring [Claude Code Router](https://github.com/musistudio/claude-code-router) to work with the Hicap API for multi-model, multi-provider AI development.

## Prerequisites

- Node.js (v20+) installed
- Your Hicap API key

## Installation

```shell
npm install -g @anthropic-ai/claude-code
npm install -g @musistudio/claude-code-router
```

This installs both `claude` and `ccr` CLI tools globally.

## Configuration

Create or edit `~/.claude-code-router/config.json`:

```json
{
  "LOG": true,
  "LOG_LEVEL": "debug",
  "HOST": "127.0.0.1",
  "PORT": 3456,
  "APIKEY": "$HICAP_API_KEY",
  "API_TIMEOUT_MS": "600000",
  "transformers": [
    { "path": "~/.claude-code-router/hicap-transformer.js" }
  ],
  "Providers": [
    {
      "name": "hicap",
      "api_base_url": "https://api.hicap.ai/v1/chat/completions",
      "api_key": "$HICAP_API_KEY",
      "models": [
        "claude-opus-4.5",
        "claude-sonnet-4.5",
        "claude-haiku-4.5",
        "gpt-5.2",
        "gpt-5.1",
        "gemini-3-pro-preview",
        "gemini-3-flash-preview"
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

### Configuration Options

| Option | Description |
|--------|-------------|
| `APIKEY` | Your Hicap API key (supports `$ENV_VAR` interpolation) |
| `API_TIMEOUT_MS` | Request timeout in milliseconds |
| `transformers` | Array of custom transformer paths |
| `Providers` | Provider configurations with name, URL, key, and models |
| `Router` | Model routing rules for different task types |

### Router Options

| Route | Description |
|-------|-------------|
| `default` | General task model |
| `background` | Background/smaller tasks |
| `think` | Reasoning-heavy tasks |
| `longContext` | Large context handling |
| `longContextThreshold` | Token count trigger (default: 60000) |
| `webSearch` | Web search tasks |
| `image` | Image-related tasks |

## Hicap Transformer

Create `~/.claude-code-router/hicap-transformer.js`:

```js
module.exports = class HicapTransformer {
  static name = "hicap";
  name = "hicap";

  async transformRequestIn(request, provider, context) {
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

  async auth(request, provider, context) {
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

  async transformResponseOut(response) {
    return response;
  }
};
```

This transformer injects the Hicap API key via the `api-key` header.

## Usage

### Start the Router

```shell
ccr start
```

### Run Claude Code

```shell
ccr code "Write a Hello World in Python"
```

### Use Direct Claude Command

```shell
eval "$(ccr activate)"
claude "Your prompt here"
```

## Commands

| Command | Description |
|---------|-------------|
| `ccr start` | Start the router server |
| `ccr stop` | Stop the router server |
| `ccr restart` | Restart after config changes |
| `ccr status` | Check server status |
| `ccr code` | Start Claude Code with router |
| `ccr ui` | Open web-based configuration |
| `ccr model` | Interactive CLI model selector |
| `ccr preset list` | List available presets |

## Supported Models

Via Hicap, you have access to:

| Provider | Models |
|----------|--------|
| Claude | claude-opus-4.5, claude-sonnet-4.5, claude-haiku-4.5 |
| OpenAI | gpt-5.2, gpt-5.1 |
| Google | gemini-3-pro-preview, gemini-3-flash-preview |

## Troubleshooting

1. **API Key Issues**: Ensure `HICAP_API_KEY` environment variable is set, or replace `$HICAP_API_KEY` with your actual key in config
2. **Transformer Not Found**: Verify the path in `transformers` array is correct
3. **Connection Errors**: Check that `ccr start` is running and port 3456 is available

---

For the latest setup instructions, see: https://github.com/musistudio/claude-code-router

Questions? Reach out to [Hicap support](mailto:support@hicap.ai) or open an issue in the repository.
