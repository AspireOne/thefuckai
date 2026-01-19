import { exec } from "node:child_process";
import { promisify } from "node:util";
import type { ShellAdapter, CommandContext } from "./types.js";

const execAsync = promisify(exec);

export class BashAdapter implements ShellAdapter {
  async getLastCommand(): Promise<CommandContext | null> {
    // fast, non-interactive history lookup not easily possible in pure node without help from shell
    // The user really should use the shell alias/function for full functionality.
    // However, we can try to read ~/.bash_history if forced, but that's flaky (timestamps etc).
    
    // Instead, we rely on the shell wrapper passing the command.
    // If called directly without wrapper:
    return null; 
  }

  async executeCommand(command: string): Promise<{ output: string; exitCode: number }> {
    try {
      // Use bash -c to execute. 
      // We escape single quotes in the command by replacing ' with '\''
      const escapedCommand = command.replace(/'/g, "'\\''");
      const { stdout, stderr } = await execAsync(
        `bash -c '${escapedCommand}'`,
        { encoding: "utf-8" }
      );
      return {
        output: stdout + stderr,
        exitCode: 0,
      };
    } catch (error) {
      const execError = error as { stdout?: string; stderr?: string; code?: number };
      return {
        output: (execError.stdout ?? "") + (execError.stderr ?? ""),
        exitCode: execError.code ?? 1,
      };
    }
  }

  getSetupInstructions(): string {
    return `
# Add this to your .bashrc or .zshrc:

function fuck() {
    # Get last command from history (ignores leading spaces)
    # 'fc -ln -1' gets the last command, 'sed' removes leading whitespace
    TF_CMD=$(fc -ln -1 | sed 's/^[[:space:]]*//')
    
    if [ -z "$TF_CMD" ]; then
        echo "No command in history"
        return
    fi

    # Re-execute to capture output (stdout + stderr)
    # We use a subshell to capture combined output
    TF_OUTPUT=$($TF_CMD 2>&1)
    
    # Call tf-ai with captured command and output
    tf-ai --command "$TF_CMD" --output "$TF_OUTPUT"
}
`.trim();
  }
}

export const bash = new BashAdapter();
