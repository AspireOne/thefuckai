import chalk from "chalk";
import type { CommandSuggestion, AnalysisResult } from "../ai/index.js";
import { theme } from "./theme.js";

const ICONS = {
  robot: "🤖",
  lightbulb: "💡",
  command: "➜",
  warning: "⚠️",
  error: "❌",
  success: "✓",
  thinking: "🧠",
};

export function printHeader(): void {
  // Clean header using theme
  console.log(theme.header(`\n${ICONS.robot} thefuckai\n`));
}

export function printExplanation(result: AnalysisResult): void {
  if (result.explanation) {
    console.log(theme.explanation(result.explanation));
    console.log();
  }
}

let lastPrintedLength = 0;

/**
 * For streaming: prints only the new part of the explanation
 */
export function printStreamingExplanation(fullText: string): void {
  if (!fullText) return;
  
  // Calculate the new chunk to print
  const newText = fullText.slice(lastPrintedLength);
  
  if (newText) {
    // Use theme explanation color
    process.stdout.write(theme.explanation(newText));
    lastPrintedLength = fullText.length;
  }
}

/**
 * Finalize streaming output with newline and reset state
 */
export function finalizeStreaming(): void {
  console.log(); // New line after streaming completes
  lastPrintedLength = 0; // Reset for next run
}

export function printSuggestion(suggestion: CommandSuggestion): void {
  const confidenceColor = {
    high: theme.confidenceHigh,
    medium: theme.confidenceMedium,
    low: theme.confidenceLow,
  }[suggestion.confidence];

  console.log(theme.suggestionLabel(`${ICONS.lightbulb} Suggested fix:`));
  console.log();
  // Using theme.command color
  console.log(theme.command(`  ${ICONS.command} ${suggestion.command}  `));
  console.log();
  
  console.log(
    theme.muted("Confidence: ") + 
    confidenceColor(suggestion.confidence)
  );
  console.log();
}

export function printError(message: string): void {
  console.error(theme.error(`${ICONS.error} ${message}`));
}

export function printWarning(message: string): void {
  console.log(theme.warning(`${ICONS.warning} ${message}`));
}

export function printSuccess(message: string): void {
  console.log(theme.success(`${ICONS.success} ${message}`));
}

export function printCommand(label: string, command: string): void {
  console.log(theme.muted(`${label}: `) + theme.text(command));
}

export function printVerbose(message: string, verbose: boolean): void {
  if (verbose) {
    console.log(theme.muted(`[debug] ${message}`));
  }
}
