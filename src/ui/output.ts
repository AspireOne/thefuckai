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

/**
 * For streaming: clears current line and prints updated explanation
 */
export function printStreamingExplanation(text: string): void {
  // Clear current output and reprint (for terminal streaming effect)
  process.stdout.write(`\r${chalk.white(text)}`);
}

/**
 * Finalize streaming output with newline
 */
export function finalizeStreaming(): void {
  console.log(); // New line after streaming completes
}

export function printSuggestion(suggestion: CommandSuggestion): void {
  const confidenceColor = {
    high: chalk.green,
    medium: chalk.yellow,
    low: chalk.red,
  }[suggestion.confidence];

  console.log(chalk.cyan(`${ICONS.lightbulb} Suggested fix:`));
  console.log();
  console.log(chalk.bgGray.white.bold(`  ${ICONS.command} ${suggestion.command}  `));
  console.log();
  
  console.log(
    chalk.gray("Confidence: ") + 
    confidenceColor(suggestion.confidence)
  );
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
