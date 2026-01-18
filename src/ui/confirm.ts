import * as readline from "node:readline";
import chalk from "chalk";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { theme } from "./theme.js";

const execAsync = promisify(exec);

export interface ConfirmResult {
  action: "run" | "cancel" | "edit";
  editedCommand?: string;
}

export async function confirmCommand(command: string): Promise<ConfirmResult> {
  return new Promise((resolve) => {
    console.log(theme.secondary("Press:"));
    console.log(theme.muted("  [Enter] Run command"));
    console.log(theme.muted("  [e]     Edit command"));
    console.log(theme.muted("  [Esc/q] Cancel"));
    console.log();

    // Set up raw mode to capture single keypresses
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    const cleanup = () => {
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(false);
      }
      process.stdin.pause();
      process.stdin.removeAllListeners("data");
    };

    process.stdin.once("data", (key: string) => {
      cleanup();

      // Enter key
      if (key === "\r" || key === "\n") {
        resolve({ action: "run" });
        return;
      }

      // Escape or q
      if (key === "\u001b" || key === "q" || key === "\u0003") {
        console.log(theme.warning("Cancelled"));
        resolve({ action: "cancel" });
        return;
      }

      // Edit
      if (key === "e" || key === "E") {
        resolve({ action: "edit" });
        return;
      }

      // Unknown key - treat as cancel
      console.log(theme.warning("Cancelled"));
      resolve({ action: "cancel" });
    });
  });
}

export async function editCommand(originalCommand: string): Promise<string | null> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log(theme.secondary("\nEdit command (press Enter to confirm, Ctrl+C to cancel):"));
    
    rl.question(theme.muted("> "), (answer) => {
      rl.close();
      const command = answer.trim();
      resolve(command || originalCommand);
    });

    rl.on("close", () => {
      if (!rl.terminal) {
        resolve(null);
      }
    });
  });
}

export async function runCommand(command: string): Promise<void> {
  console.log(theme.secondary(`\nRunning: ${command}\n`));
  console.log(theme.muted("─".repeat(40)));
  
  try {
    // Run the command and stream output
    const { stdout, stderr } = await execAsync(
      `powershell -Command "${command.replace(/"/g, '\\"')}"`,
      { encoding: "utf-8" }
    );
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(theme.error(stderr));
    
    console.log(theme.muted("─".repeat(40)));
    console.log(theme.success("✓ Command completed"));
  } catch (error) {
    const execError = error as { stdout?: string; stderr?: string; code?: number };
    if (execError.stdout) console.log(execError.stdout);
    if (execError.stderr) console.error(theme.error(execError.stderr));
    
    console.log(theme.muted("─".repeat(40)));
    console.log(theme.error(`✗ Command failed with exit code ${execError.code ?? 1}`));
  }
}
