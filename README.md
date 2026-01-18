# thefuckai 🤖

> *AI-powered terminal assistant that explains command output and helps you troubleshoot*

**thefuckai** uses Large Language Models to analyze your terminal commands and their output. Whether you hit an error, got unexpected behavior, or just want to understand what happened — it explains what's going on and suggests what to do next.

## ✨ What It Does

- **🔍 Explains Output** — Interprets error messages, warnings, and confusing output in plain English
- **🧠 Troubleshoots Issues** — Diagnoses build failures, permission errors, network issues, and more
- **💡 Suggests Next Steps** — Offers follow-up commands when there's a clear action to take
- **⚡ Streams in Real-Time** — See the AI's response as it types, no waiting for the full answer
- **🔌 Multi-Provider** — Works with Claude, GPT-4, Gemini, and any [Vercel AI SDK](https://sdk.vercel.ai) provider

## 📦 Installation

```bash
# Install globally
npm install -g thefuckai

# Or use directly with npx
npx thefuckai --help
```

## ⚙️ Configuration

Set your API key:

```bash
# Anthropic (recommended)
export ANTHROPIC_API_KEY="sk-ant-..."

# Or OpenAI
export OPENAI_API_KEY="sk-..."
```

Or create `~/.thefuckai/config.json`:

```json
{
  "model": "claude-sonnet-4-5-20250929",
  "apiKey": "sk-ant-..."
}
```

## 🚀 Usage

### Direct Usage

```bash
# Analyze a command and its output
thefuckai --command "npm run build" --output "Error: Cannot find module 'react'"

# Just get an explanation (no command suggestion)
thefuckai --command "git status" --output "..." --explain

# Auto-run the suggested command
thefuckai --command "..." --output "..." --yes
```

### Shell Integration (Recommended)

Add this to your PowerShell profile (`$PROFILE`):

```powershell
function fuck {
    $lastCmd = (Get-History -Count 1).CommandLine
    if (-not $lastCmd) {
        Write-Host "No command in history" -ForegroundColor Red
        return
    }
    
    $output = try { 
        Invoke-Expression $lastCmd 2>&1 | Out-String 
    } catch { 
        $_.Exception.Message 
    }
    
    thefuckai --command $lastCmd --output $output
}
```

Now just type `fuck` after any command to get help:

```
PS> git pussh origin main
git: 'pussh' is not a git command. See 'git --help'.

PS> fuck
🤖 thefuckai

You have a typo: 'pussh' should be 'push'. Git commands are case-sensitive 
and must be spelled exactly...

💡 Suggested fix:
  ➜ git push origin main

Confidence: high

Press: [Enter] Run | [e] Edit | [Esc] Cancel
```

## 🛠️ Development

```bash
git clone https://github.com/yourusername/thefuckai.git
cd thefuckai
pnpm install
pnpm dev -- --help
```

## 📄 License

MIT
