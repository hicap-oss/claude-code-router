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

Hicap is configured by default: a fresh Claude Code Router install already contains a
`hicap` provider pointing at `https://api.hicap.ai/v1`, so the only required step is
exporting your key.

```shell
export HICAP_API_KEY="your-hicap-api-key"
```

To write the provider out explicitly, or to edit an existing
`~/.claude-code-router/config.json`, use this shape:

```json
{
  "LOG": true,
  "LOG_LEVEL": "debug",
  "HOST": "127.0.0.1",
  "PORT": 3456,
  "APIKEY": "",
  "API_TIMEOUT_MS": "600000",
  "Providers": [
    {
      "name": "hicap",
      "type": "openai_chat_completions",
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
      ]
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

Hicap speaks the OpenAI chat completions protocol, so `type` is
`openai_chat_completions`. The provider base URL is `https://api.hicap.ai/v1`, and
`api_base_url` takes the full chat completions endpoint under it.

| Option | Description |
|--------|-------------|
| `APIKEY` | Optional key that local clients must send to the router itself (not your Hicap key) |
| `API_TIMEOUT_MS` | Request timeout in milliseconds |
| `Providers` | Provider configurations with name, protocol, URL, key, and models |
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

## Authentication

Hicap authenticates with an `api-key` request header instead of a bearer
`Authorization` header. Claude Code Router handles this at the provider boundary:
requests routed to `api.hicap.ai` have the provider credential placed in the
`api-key` header and the bearer `Authorization` header removed. No custom
transformer file is required.

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

1. **API Key Issues**: Ensure the `HICAP_API_KEY` environment variable is set, or replace `$HICAP_API_KEY` with your actual key in config
2. **401 Unauthorized**: Confirm `api_base_url` points at `https://api.hicap.ai/v1/chat/completions` so the `api-key` header is applied
3. **Connection Errors**: Check that `ccr start` is running and port 3456 is available

---

For the latest setup instructions, see: https://github.com/musistudio/claude-code-router

Questions? Reach out to [Hicap support](mailto:support@hicap.ai) or open an issue in the repository.
