# tf-ai 🤖

> *The AI-powered successor to `thefuck` — explains errors, fixes commands, and troubleshoots your terminal.*

**tf-ai** is a smart CLI tool that uses Large Language Models (LLMs) to analyze your terminal commands and their output. It understands your environment (Shell, OS, Project Type) to provide tailored explanations and fixes.

Run a command, fail, type `fuck`, and let AI handle the rest.

## ✨ Features

- **🧠 Context-Aware Analysis**: Understanding not just *what* failed, but *where* (PowerShell vs Bash, Node.js vs Python project, etc).
- **📝 Plain English Explanations**: Deciphers cryptic error codes and log spew into clear, actionable insights.
- **⚡ Real-Time Streaming**: Watch the explanation appear instantly — no waiting for the full response.
- **🛠️ Smart Suggestions**: Offers corrected commands that match your specific shell syntax.
- **🔌 Provider Agnostic**: Works with Anthropic (Claude), OpenAI (GPT-4), Google (Gemini), or any [Vercel AI SDK](https://sdk.vercel.ai) compatible provider.

## 📦 Installation

```bash
# Install globally via npm
npm install -g tf-ai

# Or run directly
npx tf-ai --help
```

## ⚙️ Configuration

1. **Set your API Key** (Required)

   ```bash
   export ANTHROPIC_API_KEY="sk-ant-..."
   # OR
   export OPENAI_API_KEY="sk-..."
   ```

2. **Advanced Config** (Optional)
   
   Create `~/.tf-ai/config.json`:
   ```json
   {
     "model": "claude-3-5-sonnet-latest",
     "confirmBeforeRun": true,
     "verbose": false
   }
   ```

## 🚀 Usage

### 1. Setup Shell Integration (Recommended)

To use the `fuck` alias, run the setup command for your shell:

```bash
tf-ai --setup
```
Follow the instructions to add the function to your shell profile (PowerShell `$PROFILE`, `.bashrc`, etc).

### 2. The "Fuck" Workflow

```powershell
# 1. Mess up a command
PS> git pussh origin main
git: 'pussh' is not a git command.

# 2. Summon the AI
PS> fuck

# 3. Get help instantly
🤖 tf-ai
   It looks like you made a typo. 'pussh' is not a valid git command.

💡 Suggested command:
   ➜ git push origin main

   [Enter] Run  [e] Edit  [Esc] Cancel
```

### 3. Direct Usage

You can also use it manually to analyze specific errors:

```bash
# Analyze a specific failure
tf-ai --command "npm install" --output "EBADENGINE Unsupported engine"

# Just get an explanation without fixes
tf-ai --command "ls -la" --explain
```

## 🛠️ Development

```bash
git clone https://github.com/yourusername/thefuckai.git
cd thefuckai
pnpm install

# Run locally
pnpm dev -- --command "echo test" --output "error"
```

## 📄 License

MIT
