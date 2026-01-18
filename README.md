# thefuckai 🤖

> *A modern, AI-powered successor to the legendary [thefuck](https://github.com/nvbn/thefuck)*

**thefuckai** is a terminal assistant that uses Large Language Models (LLMs) to intelligently analyze your previous command, explain what went wrong, and suggest a fix.

Instead of relying on hardcoded rules and regex, it uses the reasoning capabilities of modern AI (Claude, GPT-4, etc.) to understand context, complex errors, and even specific tool usage.

## ✨ Features

- **🔍 Intelligent Diagnostics**: Explains *why* a command failed in plain English.
- **🛠️ Auto-Correction**: Suggests the correct command to run.
- **⚡ Provider Agnostic**: Works with Anthropic (Claude), OpenAI (GPT), Google (Gemini), and any other provider supported by the [Vercel AI SDK](https://sdk.vercel.ai/docs).
- **🐚 Cross-Platform**: (Currently in development) Designed for PowerShell, Bash, and Zsh.
- **🚀 Fast**: Built with Node.js and TypeScript for quick startup times.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- An API key for your preferred AI provider (e.g., Anthropic, OpenAI)

### Installation

```bash
# Install via npm/pnpm/yarn
npm install -g thefuckai

# OR run directly via npx
npx thefuckai
```

### Configuration

Set your API key as an environment variable:

```bash
# For Anthropic (Recommended)
export ANTHROPIC_API_KEY="sk-ant-..."

# For OpenAI
export OPENAI_API_KEY="sk-..."
```

### Usage

1. **The "Fuck" Alias** (Recommended)
   
   Add the alias to your shell profile to easily invoke the tool after a failed command.
   
   **PowerShell:**
   ```powershell
   function fuck {
       $lastCmd = (Get-History -Count 1).CommandLine
       # ... integration script (coming soon) ...
       thefuckai --command $lastCmd
   }
   ```
## 🛠️ Development

```bash
# Clone the repo
git clone https://github.com/yourusername/thefuckai.git

# Install dependencies
pnpm install

# Run locally
pnpm dev -- --help
```

## 📄 License

MIT
