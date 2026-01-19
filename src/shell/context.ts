import { existsSync } from "node:fs";
import { join } from "node:path";
import { platform } from "node:os";

export interface EnvironmentContext {
  shell: "powershell" | "bash" | "zsh" | "cmd" | "fish" | "unknown";
  os: "windows" | "macos" | "linux";
  cwd: string;
  projectType?: "git" | "nodejs" | "python" | "docker";
}

function detectShell(): EnvironmentContext["shell"] {
  // Check SHELL env var (Unix-like systems) - Check this FIRST to avoid false positives on Linux
  const shell = process.env["SHELL"];
  if (shell) {
    if (shell.includes("bash")) return "bash";
    if (shell.includes("zsh")) return "zsh";
    if (shell.includes("fish")) return "fish";
  }

  // Check for PowerShell-specific env var
  if (process.env["PSModulePath"]) {
    return "powershell";
  }
  
  // Check for CMD on Windows
  if (process.env["ComSpec"]?.includes("cmd.exe")) {
    return "cmd";
  }
  
  return "unknown";
}

function detectOS(): EnvironmentContext["os"] {
  const os = platform();
  
  switch (os) {
    case "win32":
      return "windows";
    case "darwin":
      return "macos";
    case "linux":
      return "linux";
    default:
      // Fallback to linux for other Unix-like systems
      return "linux";
  }
}

function detectProjectType(cwd: string): EnvironmentContext["projectType"] {
  // Check in order of specificity
  if (existsSync(join(cwd, ".git"))) {
    return "git";
  }
  
  if (existsSync(join(cwd, "package.json"))) {
    return "nodejs";
  }
  
  if (existsSync(join(cwd, "requirements.txt")) || existsSync(join(cwd, "pyproject.toml"))) {
    return "python";
  }
  
  if (existsSync(join(cwd, "Dockerfile"))) {
    return "docker";
  }
  
  return undefined;
}

export function detectEnvironment(): EnvironmentContext {
  const cwd = process.cwd();
  const projectType = detectProjectType(cwd);
  
  return {
    shell: detectShell(),
    os: detectOS(),
    cwd,
    ...(projectType ? { projectType } : {}),
  };
}
