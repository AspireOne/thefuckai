/** Context about a command that was executed */
export interface CommandContext {
  /** The command that was run */
  command: string;
  /** Combined stdout + stderr output */
  output: string;
  /** Exit code if available */
  exitCode?: number;
  /** Working directory where the command was run */
  cwd?: string;
  /** Whether this command has captured output (true for the most recent command) */
  hasOutput?: boolean;
}

/** Interface for shell integrations */
export interface ShellAdapter {
  /** Get the last command from shell history */
  getLastCommand(): Promise<CommandContext | null>;
  /** Get the last N commands from shell history (command text only, no output) */
  getCommandHistory(count: number): Promise<string[]>;
  /** Execute a command and return its output */
  executeCommand(command: string): Promise<{ output: string; exitCode: number }>;
  /** Get instructions for setting up this shell integration */
  getSetupInstructions(): string;
}
