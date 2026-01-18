import { exec } from "node:child_process";
import { promisify } from "node:util";
import type { ShellAdapter, CommandContext } from "./types.js";

const execAsync = promisify(exec);

export class PowerShellAdapter implements ShellAdapter {
  async getLastCommand(): Promise<CommandContext | null> {
    // This is called when the user runs thefuckai without explicit --command
    // We try to get the last command from PowerShell history
    try {
      const { stdout } = await execAsync(
        'powershell -Command "(Get-History -Count 1).CommandLine"',
        { encoding: "utf-8" }
      );
      
      const command = stdout.trim();
      if (!command) {
        return null;
      }
      
      // We can't reliably get the output of the previous command after the fact
      // The user should use the shell function which captures output in real-time
      return {
        command,
        output: "(Output not captured - use the 'fuck' shell function for full functionality)",
      };
    } catch {
      return null;
    }
  }

  async executeCommand(command: string): Promise<{ output: string; exitCode: number }> {
    try {
      const { stdout, stderr } = await execAsync(
        `powershell -Command "${command.replace(/"/g, '\\"')}"`,
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
Add this to your PowerShell profile ($PROFILE):

function fuck {
    $lastCmd = (Get-History -Count 1).CommandLine
    if (-not $lastCmd) {
        Write-Host "No command in history" -ForegroundColor Red
        return
    }
    
    # Re-execute to capture output
    $output = try { 
        Invoke-Expression $lastCmd 2>&1 | Out-String 
    } catch { 
        $_.Exception.Message 
    }
    
    # Call thefuckai with captured command and output
    thefuckai --command $lastCmd --output $output
}

Then reload your profile:
. $PROFILE
`.trim();
  }
}

export const powershell = new PowerShellAdapter();
