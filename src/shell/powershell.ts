import { exec } from "node:child_process";
import { promisify } from "node:util";
import type { ShellAdapter, CommandContext } from "./types.js";

const execAsync = promisify(exec);

export class PowerShellAdapter implements ShellAdapter {
  async getLastCommand(): Promise<CommandContext | null> {
    // This is called when the user runs tf-ai without explicit --command
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
        hasOutput: false,
      };
    } catch {
      return null;
    }
  }

  async getCommandHistory(count: number): Promise<string[]> {
    try {
      const { stdout } = await execAsync(
        `powershell -Command "(Get-History -Count ${count}).CommandLine"`,
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
    # Get last 3 commands from history (for context)
    $historyItems = Get-History -Count 3
    $historyCommands = @()
    foreach ($item in $historyItems) {
        $historyCommands += $item.CommandLine
    }
    
    if ($historyCommands.Count -eq 0) {
        Write-Host "No command in history" -ForegroundColor Red
        return
    }
    
    # The last command is the one we'll capture output for
    $lastCmd = $historyCommands[-1]
    
    # Build history JSON (all commands except the last, which will have output)
    $historyJson = @()
    for ($i = 0; $i -lt $historyCommands.Count - 1; $i++) {
        $historyJson += @{
            command = $historyCommands[$i]
            hasOutput = $false
        }
    }
    $historyArg = ($historyJson | ConvertTo-Json -Compress) -replace '"', '\\\\"'
    
    # Ask for confirmation before re-executing
    Write-Host "Last command: " -NoNewline
    Write-Host $lastCmd -ForegroundColor Cyan
    $confirm = Read-Host "Re-run to capture output? (y/n)"
    
    $output = ""
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        # Re-execute last command to capture output
        $output = try { 
            Invoke-Expression $lastCmd 2>&1 | Out-String 
        } catch { 
            $_.Exception.Message 
        }
    } elseif ($confirm -eq "n" -or $confirm -eq "N") {
        $output = "(output not captured - user skipped re-execution)"
    } else {
        Write-Host "Cancelled" -ForegroundColor Yellow
        return
    }
    
    # Call tf-ai with captured command, output, and history
    if ($historyJson.Count -gt 0) {
        tf-ai --command $lastCmd --output $output --history "$historyArg"
    } else {
        tf-ai --command $lastCmd --output $output
    }
}

Then reload your profile:
. $PROFILE
`.trim();
  }
}

export const powershell = new PowerShellAdapter();

