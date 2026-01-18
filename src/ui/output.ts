import chalk from "chalk";
import type { CommandSuggestion, AnalysisResult } from "../ai/index.js";

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
  console.log(chalk.cyan.bold(`\n${ICONS.robot} thefuckai\n`));
}

export function printExplanation(result: AnalysisResult): void {
  if (result.explanation) {
    console.log(chalk.white(result.explanation));
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
    process.stdout.write(chalk.white(newText));
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
    high: chalk.green,
    medium: chalk.yellow,
    low: chalk.red,
  }[suggestion.confidence];

  console.log(chalk.cyan(`${ICONS.lightbulb} Suggested command:`));
  console.log();
  console.log(chalk.bgGray.white.bold(`  ${ICONS.command} ${suggestion.command}  `));
  console.log();

  console.log(chalk.gray("Confidence: ") + confidenceColor(suggestion.confidence));
  console.log();
}

export function printError(message: string): void {
  console.error(chalk.red(`${ICONS.error} ${message}`));
}

export function printWarning(message: string): void {
  console.log(chalk.yellow(`${ICONS.warning} ${message}`));
}

export function printSuccess(message: string): void {
  console.log(chalk.green(`${ICONS.success} ${message}`));
}

export function printCommand(label: string, command: string): void {
  console.log(chalk.gray(`${label}: `) + chalk.white(command));
}

export function printVerbose(message: string, verbose: boolean): void {
  if (verbose) {
    console.log(chalk.gray(`[debug] ${message}`));
  }
}
