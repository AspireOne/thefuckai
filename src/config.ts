import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export interface Config {
  /** Model identifier, e.g. "anthropic/claude-sonnet-4-20250514" or "openai/gpt-4o" */
  model: string;
  /** Provider to use: anthropic, openai, or google */
  provider: "anthropic" | "openai" | "google";
  /** API key for the selected provider */
  apiKey: string;
  /** Whether to ask for confirmation before running suggested commands */
  confirmBeforeRun: boolean;
  /** Show verbose/debug output */
  verbose: boolean;
}

interface ConfigFile {
  model?: string;
  provider?: "anthropic" | "openai" | "google";
  apiKey?: string;
  confirmBeforeRun?: boolean;
  verbose?: boolean;
}

const CONFIG_DIR = join(homedir(), ".tf-ai");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

function loadConfigFile(): ConfigFile {
  if (!existsSync(CONFIG_FILE)) {
    return {};
  }
  
  try {
    const content = readFileSync(CONFIG_FILE, "utf-8");
    return JSON.parse(content) as ConfigFile;
  } catch {
    return {};
  }
}

function detectProvider(model: string): "anthropic" | "openai" | "google" {
  if (model.startsWith("anthropic/") || model.includes("claude")) {
    return "anthropic";
  }
  if (model.startsWith("openai/") || model.includes("gpt")) {
    return "openai";
  }
  if (model.startsWith("google/") || model.includes("gemini")) {
    return "google";
  }
  // Default to anthropic
  return "anthropic";
}

function getApiKey(provider: "anthropic" | "openai" | "google", configKey?: string): string {
  // Config file key takes precedence
  if (configKey) {
    return configKey;
  }
  
  // Then check environment variables
  const envVars = {
    anthropic: "ANTHROPIC_API_KEY",
    openai: "OPENAI_API_KEY",
    google: "GOOGLE_API_KEY",
  } as const;
  
  const envVarName = envVars[provider];
  const envKey = process.env[envVarName];
  if (envKey) {
    return envKey;
  }
  
  // Also check generic key
  return process.env["TF_AI_API_KEY"] ?? "";
}

export function loadConfig(overrides?: Partial<Config>): Config {
  const file = loadConfigFile();
  
  // Determine model (priority: override > env > file > default)
  const model =
    overrides?.model ??
    process.env["TF_AI_MODEL"] ??
    file.model ??
    "claude-sonnet-4-5-20250929";
  
  // Detect provider from model string
  const provider = 
    overrides?.provider ?? 
    file.provider ?? 
    detectProvider(model);
  
  // Get API key
  const apiKey = getApiKey(provider, file.apiKey);
  
  return {
    model,
    provider,
    apiKey,
    confirmBeforeRun: overrides?.confirmBeforeRun ?? file.confirmBeforeRun ?? true,
    verbose: overrides?.verbose ?? file.verbose ?? false,
  };
}

export function validateConfig(config: Config): { valid: boolean; error?: string } {
  if (!config.apiKey) {
    const envVar = {
      anthropic: "ANTHROPIC_API_KEY",
      openai: "OPENAI_API_KEY",
      google: "GOOGLE_API_KEY",
    }[config.provider];
    
    return {
      valid: false,
      error: `No API key found. Set ${envVar} environment variable or add "apiKey" to ${CONFIG_FILE}`,
    };
  }
  
  return { valid: true };
}

export { CONFIG_DIR, CONFIG_FILE };
