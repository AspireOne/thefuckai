# AI SDK

The [AI SDK](https://ai-sdk.dev/docs) is a provider-agnostic TypeScript toolkit designed to help you build AI-powered applications and agents using popular UI frameworks like Next.js, React, Svelte, Vue, Angular, and runtimes like Node.js.

To learn more about how to use the AI SDK, check out our [API Reference](https://ai-sdk.dev/docs/reference) and [Documentation](https://ai-sdk.dev/docs).

## Installation

You will need Node.js 18+ and npm (or another package manager) installed on your local development machine.

```shell
npm install ai
```

## Unified Provider Architecture

The AI SDK provides a [unified API](https://ai-sdk.dev/docs/foundations/providers-and-models) to interact with model providers like [OpenAI](https://ai-sdk.dev/providers/ai-sdk-providers/openai), [Anthropic](https://ai-sdk.dev/providers/ai-sdk-providers/anthropic), [Google](https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai), and [more](https://ai-sdk.dev/providers/ai-sdk-providers).

By default, the AI SDK uses the [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) to give you access to all major providers out of the box. Just pass a model string for any supported model:

```ts
const result = await generateText({
  model: 'anthropic/claude-opus-4.5', // or 'openai/gpt-5.2', 'google/gemini-3-flash', etc.
  prompt: 'Hello!',
});
```

You can also connect to providers directly using their SDK packages:

```shell
npm install @ai-sdk/openai @ai-sdk/anthropic @ai-sdk/google
```

```ts
import { anthropic } from '@ai-sdk/anthropic';

const result = await generateText({
  model: anthropic('claude-opus-4-5-20250414'), // or openai('gpt-5.2'), google('gemini-3-flash'), etc.
  prompt: 'Hello!',
});
```

## Usage

### Generating Text

```ts
import { generateText } from 'ai';

const { text } = await generateText({
  model: 'openai/gpt-5', // use Vercel AI Gateway
  prompt: 'What is an agent?',
});
```

```ts
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-5'), // use OpenAI Responses API
  prompt: 'What is an agent?',
});
```

### Generating Structured Data

```ts
import { generateText, Output } from 'ai';
import { z } from 'zod';

const { output } = await generateText({
  model: 'openai/gpt-5',
  output: Output.object({
    schema: z.object({
      recipe: z.object({
        name: z.string(),
        ingredients: z.array(
          z.object({ name: z.string(), amount: z.string() }),
        ),
        steps: z.array(z.string()),
      }),
    }),
  }),
  prompt: 'Generate a lasagna recipe.',
});
```

### Agents

```ts
import { ToolLoopAgent } from 'ai';

const sandboxAgent = new ToolLoopAgent({
  model: 'openai/gpt-5',
  system: 'You are an agent with access to a shell environment.',
  tools: {
    shell: openai.tools.localShell({
      execute: async ({ action }) => {
        const [cmd, ...args] = action.command;
        const sandbox = await getSandbox(); // Vercel Sandbox
        const command = await sandbox.runCommand({ cmd, args });
        return { output: await command.stdout() };
      },
    }),
  },
});
```

## About Gateway

Vercel’s AI SDK can be used purely as an SDK while sending requests **directly** to OpenAI using your own OpenAI API key, with no requirement to use the Vercel AI Gateway.

## Direct OpenAI (no Gateway)
The AI SDK’s OpenAI provider (`@ai-sdk/openai`) defaults to the OpenAI API base URL `https://api.openai.com/v1`, so it talks to OpenAI servers directly unless you change it.
It also defaults to reading your key from `OPENAI_API_KEY` (or you can pass `apiKey` explicitly).

```ts
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-4.1-mini'),
  prompt: 'Hello!',
});
```

## Avoid the “Gateway by default” behavior
If you pass a *plain string* as the model (e.g. `model: 'openai/gpt-5.2'`), the AI SDK treats the Vercel AI Gateway as the default provider for that style of call.
To avoid the Gateway, either (a) use a provider instance like `openai('...')` (shown above) or (b) set the default provider globally to `openai`.

```ts
import { openai } from '@ai-sdk/openai';

globalThis.AI_SDK_DEFAULT_PROVIDER = openai;
```

## When you *are* using Vercel AI Gateway
Vercel positions the AI Gateway as a separate product built on top of the AI SDK (i.e., they’re coupled, but not required together).
If you do want the Gateway, you typically point an OpenAI-compatible client (including the AI SDK via `@ai-sdk/openai-compatible`) at Vercel’s Gateway base URL.