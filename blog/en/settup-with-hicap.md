@ -1,281 +0,0 @@
# Supercharge Your Claude Code Workflow with HiCap's Smart Model Routing

*By the HiCap Engineering Team*

---

We built HiCap because we believe developers deserve better tools. When we started seeing how many of you were using Claude Code for serious development work, we knew we had to make the integration seamless. Today, I want to walk you through a setup that several of our power users have been asking about: using Claude Code Router to unlock HiCap's full model routing capabilities.

If you're already a HiCap user running Claude Code, this is for you.

## Why We're Excited About This Integration

At HiCap, our mission has always been to give developers unified access to the best AI models without vendor lock-in. Claude Code is arguably the best AI coding assistant available today, and combining it with HiCap's model routing opens up possibilities that neither tool offers alone:

- **Intelligent task routing** – Send complex reasoning to Opus, quick tasks to Haiku
- **Cost optimization** – Our users report 30-50% cost reductions with smart routing
- **Model diversity** – Access Claude, GPT-5, and Gemini through your existing HiCap key
- **Zero workflow disruption** – Claude Code works exactly as before, just smarter

Let me show you how to set this up.

## The Architecture

Here's what we're building:

```
Claude Code CLI → Claude Code Router (localhost:3456) → HiCap API → Model of Choice
```

Claude Code Router is an open-source project that intercepts Claude Code requests locally. We'll configure it to route those requests through HiCap, where you get access to our full model catalog and intelligent routing.

## Prerequisites

Before we start, make sure you have:
- Node.js 18+ installed
- Claude Code CLI (`winget install Anthropic.ClaudeCode`)
- Your HiCap API key (grab it from your [dashboard](https://hicap.ai/dashboard))

## Step-by-Step Setup

### 1. Install Claude Code Router

```powershell
npm install -g @musistudio/claude-code-router
```

### 2. Create the Configuration Directory

```powershell
mkdir "$env:USERPROFILE\.claude-code-router"
```

### 3. Add the HiCap Transformer

HiCap uses `api-key` header authentication for enhanced security. Claude Code Router needs a small transformer to handle this. Create `~/.claude-code-router/hicap-transformer.js`:

```javascript
// HiCap transformer for Claude Code Router
// Uses api-key header authentication
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

We're working on getting this transformer included in Claude Code Router's official distribution, but for now this gives you full control.

### 4. Configure the Router

Create `~/.claude-code-router/config.json` with your HiCap configuration:

```json
{
  "LOG": true,
  "LOG_LEVEL": "info",
  "HOST": "127.0.0.1",
  "PORT": 3456,
  "APIKEY": "YOUR_HICAP_API_KEY",
  "API_TIMEOUT_MS": "600000",
  "transformers": [
    { 
      "path": "C:/Users/YOUR_USERNAME/.claude-code-router/hicap-transformer.js"
    }
  ],
  "Providers": [
    {
      "name": "hicap",
      "api_base_url": "https://api.hicap.ai/v1/chat/completions",
      "api_key": "YOUR_HICAP_API_KEY",
      "models": [
        "claude-opus-4.5",
        "claude-opus-4.1",
        "claude-sonnet-4.5",
        "claude-sonnet-4",
        "claude-haiku-4.5",
        "claude-3.7-sonnet",
        "gpt-5.2",
        "gpt-5",
        "gpt-4o",
        "gemini-2.5-pro",
        "gemini-2.5-flash"
      ],
      "transformer": {
        "use": ["hicap"]
      }
    }
  ],
  "Router": {
    "default": "hicap,claude-sonnet-4.5",
    "background": "hicap,claude-haiku-4.5",
    "think": "hicap,claude-opus-4.5",
    "longContext": "hicap,claude-sonnet-4.5",
    "longContextThreshold": 60000
  }
}
```

Replace `YOUR_HICAP_API_KEY` with your actual key and `YOUR_USERNAME` with your Windows username.

## Understanding the Router Configuration

The `Router` section is where HiCap's value really shines. You're telling Claude Code Router to use different models for different types of tasks:

| Route | Purpose | Recommended Model |
|-------|---------|-------------------|
| `default` | General coding tasks | `claude-sonnet-4.5` |
| `background` | Quick operations, file scanning | `claude-haiku-4.5` |
| `think` | Complex reasoning, architecture decisions | `claude-opus-4.5` |
| `longContext` | Large files, extensive codebases | `claude-sonnet-4.5` |

This is the configuration we use internally at HiCap, and it hits the sweet spot between cost and capability.

## Recommended Configurations

Based on feedback from our early adopters, here are three proven setups:

### The Balanced Developer (Most Popular)

```json
"Router": {
  "default": "hicap,claude-sonnet-4.5",
  "background": "hicap,claude-haiku-4.5",
  "think": "hicap,claude-opus-4.5",
  "longContext": "hicap,claude-sonnet-4.5",
  "longContextThreshold": 60000
}
```

Best for: Daily development work with occasional complex tasks. Typical cost savings: 35-45%.

### The Budget Optimizer

```json
"Router": {
  "default": "hicap,claude-haiku-4.5",
  "background": "hicap,claude-haiku-4.5",
  "think": "hicap,claude-sonnet-4.5",
  "longContext": "hicap,claude-sonnet-4.5",
  "longContextThreshold": 40000
}
```

Best for: Side projects, learning, high-volume usage. Typical cost savings: 60-70%.

### The Quality Maximizer

```json
"Router": {
  "default": "hicap,claude-sonnet-4.5",
  "background": "hicap,claude-sonnet-4.5",
  "think": "hicap,claude-opus-4.5",
  "longContext": "hicap,claude-opus-4.5",
  "longContextThreshold": 40000
}
```

Best for: Production code, client work, complex systems. Prioritizes output quality.

## Starting the Router

Launch your configured router:

```powershell
ccr code
```

That's it. Claude Code now routes through HiCap with your custom model selection.

## Troubleshooting Common Issues

We've collected feedback from early adopters and want to address the most common issues:

### Extended Thinking Compatibility

Some users have reported this error:

```
Expected `thinking` or `redacted_thinking`, but found `text`
```

This is a compatibility issue between certain Claude Code Router versions and extended thinking mode. Solutions:

1. Update to the latest router: `npm update -g @musistudio/claude-code-router`
2. We're actively working with the router maintainers on a permanent fix

### Authentication Errors

If you see "Invalid API key":

1. Verify your HiCap key is active in your [dashboard](https://hicap.ai/dashboard)
2. Ensure the key appears in both `APIKEY` and the provider's `api_key` field
3. Check that the transformer path uses forward slashes: `C:/Users/...`

### Stop Hook Loop

If Claude Code loops on "running stop hook":

```powershell
# Check for problematic plugins
claude plugin list

# Remove any broken plugins
claude plugin uninstall <plugin-name>
```

## What's Next

We're working on several improvements to make this integration even smoother:

- **Native HiCap plugin for Claude Code** – One-click setup coming soon
- **Usage analytics** – See which models handle which tasks in your HiCap dashboard
- **Custom routing rules** – Define your own routing logic based on file types, projects, or keywords
- **Team configurations** – Share optimized configs across your organization

## We Want Your Feedback

This integration represents exactly what we're trying to build at HiCap: tools that give developers more control without adding complexity. If you're using this setup, we want to hear from you.

- What's working well?
- What routing configurations have you discovered?
- What would make this better?

Drop us a line at developers@hicap.ai or join our [Discord community](https://discord.gg/hicap) where our engineering team hangs out.

Happy coding,

**The HiCap Team**

---

*Already a HiCap user? This setup works with your existing API key—no changes needed. New to HiCap? [Get started free](https://hicap.ai) and see why thousands of developers trust us for their AI API needs.*