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

  async getCommandHistory(count: number): Promise<string[]> {
    try {
      // Use fc to get last N commands (works in bash and zsh)
      const { stdout } = await execAsync(
        `bash -c 'fc -ln -${count} | sed "s/^[[:space:]]*//"'`,
        { encoding: "utf-8" }
      );
      
      const commands = stdout
        .split(/\r?\n/)
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0);
      
      return commands;
    } catch {
      return [];
    }
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
    local rerun=false
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -r|--rerun)
                rerun=true
                shift
                ;;
            *)
                echo "Unknown option: $1"
                echo "Usage: fuck [-r|--rerun]"
                return 1
                ;;
        esac
    done
    
    # Get last 3 commands from history (for context)
    # fc -ln -3 gets the last 3 commands, sed removes leading whitespace
    local history_cmds
    history_cmds=$(fc -ln -3 2>/dev/null | sed 's/^[[:space:]]*//')
    
    if [ -z "$history_cmds" ]; then
        echo "No command in history"
        return
    fi
    
    # Convert to array (one command per line)
    local -a cmds
    while IFS= read -r line; do
        [ -n "$line" ] && cmds+=("$line")
    done <<< "$history_cmds"
    
    local cmd_count=\${#cmds[@]}
    if [ "$cmd_count" -eq 0 ]; then
        echo "No command in history"
        return
    fi
    
    # The last command is the one we'll capture output for
    local last_cmd="\${cmds[$((cmd_count-1))]}"
    
    # Build history JSON (all commands except the last)
    local history_json="["
    local first=true
    for ((i=0; i<cmd_count-1; i++)); do
        local cmd="\${cmds[$i]}"
        # Escape quotes and backslashes for JSON
        cmd=\$(printf '%s' "$cmd" | sed 's/\\\\/\\\\\\\\/g; s/"/\\\\"/g')
        if [ "$first" = true ]; then
            first=false
        else
            history_json+=","
        fi
        history_json+="{\\\"command\\\":\\\"$cmd\\\",\\\"hasOutput\\\":false}"
    done
    history_json+="]"
    
    local TF_OUTPUT=""
    
    echo -n "Last command: "
    echo -e "\\033[36m$last_cmd\\033[0m"
    
    # Use -r/--rerun flag to re-run the command for output capture
    if [ "$rerun" = true ]; then
        echo -e "\\033[90mRe-running to capture output...\\033[0m"
        TF_OUTPUT=$($last_cmd 2>&1)
    else
        # Default: skip re-execution (no output capture)
        TF_OUTPUT="(output not captured)"
    fi
    
    # Call tf-ai with captured command, output, and history
    if [ "$cmd_count" -gt 1 ]; then
        tf-ai --command "$last_cmd" --output "$TF_OUTPUT" --history "$history_json"
    else
        tf-ai --command "$last_cmd" --output "$TF_OUTPUT"
    fi
}

# Usage:
#   fuck        - Analyze last command (without re-running it)
#   fuck -r     - Re-run last command to capture output, then analyze
#   fuck --rerun - Same as -r
`.trim();
  }
}

export const bash = new BashAdapter();
