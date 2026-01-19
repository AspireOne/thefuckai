import { detectEnvironment } from "./context.js";
import { PowerShellAdapter, powershell } from "./powershell.js";
import { BashAdapter, bash } from "./bash.js";
import type { ShellAdapter } from "./types.js";

export { PowerShellAdapter, powershell } from "./powershell.js";
export { BashAdapter, bash } from "./bash.js";
export { detectEnvironment, type EnvironmentContext } from "./context.js";
export type { ShellAdapter, CommandContext } from "./types.js";

let activeShell: ShellAdapter | null = null;

export function getShell(): ShellAdapter {
  if (activeShell) {
    return activeShell;
  }
  
  const env = detectEnvironment();
  
  switch (env.shell) {
    case "powershell":
      activeShell = powershell;
      break;
    case "bash":
    case "zsh":
      // Bash adapter works for zsh too for now as they both share 'fc'
      activeShell = bash;
      break;
    case "cmd":
      // Fallback to powershell for now on Windows if CMD is detected but we want robust features
      // Or we could implement CmdAdapter later. For now, defaulting to powershell is safer 
      // as our powershell adapter uses 'powershell -Command' which works from CMD too.
      activeShell = powershell;
      break;
    default:
      // Default fallback based on OS
      if (env.os === "windows") {
        activeShell = powershell;
      } else {
        activeShell = bash;
      }
  }
  
  return activeShell!;
}
