import type { EnvironmentContext } from "../shell/context.js";
import type { CommandContext } from "../shell/types.js";

export const SYSTEM_PROMPT = `You are an expert terminal assistant that helps developers understand command output and troubleshoot issues.

Given a command and its output (and optionally recent command history for context), analyze the situation and provide helpful insight. The output could be:
- An error message (syntax error, permission denied, command not found, etc.)
- A warning or unexpected behavior
- A build failure, test failure, or deployment issue
- API/network errors
- Confusing or unclear output that needs explanation
- Or even successful output that the user wants to understand better

Your response should:
1. **Explain** what happened
2. **Diagnose** the root cause if there's an issue, or at least speculate
3. **Suggest a command** (optional) - only if there's a clear action the user can take

Guidelines:
- Be concise but thorough (if the problem is complex/deep, you have more leeway and the output can be longer!)
- If you suggest a command, explain why / what it will do
- If you're unsure or lacking enough context, simply say so
- Apart from deliberate paragraphs, do not needlessly put newlines between sentences.
- Tailor suggestions to the user's shell and OS
- When command history is provided, use it to understand the user's workflow and intent`;


export function formatUserMessage(
  command: string, 
  output: string,
  context: EnvironmentContext
): string {
  const projectInfo = context.projectType ? `\n- Project Type: ${context.projectType}` : '';
  
  return `Command: ${command}

Output:
${output || "(no output)"}

Environment:
- Shell: ${context.shell}
- OS: ${context.os}
- Working Directory: ${context.cwd}${projectInfo}

Analyze this command and its output. Explain what happened and suggest a follow-up action if appropriate.`;
}

/**
 * Format user message with command history for better context.
 * The history array should be ordered oldest-first, with the most recent command last.
 */
export function formatUserMessageWithHistory(
  currentCommand: string,
  currentOutput: string,
  history: CommandContext[],
  context: EnvironmentContext
): string {
  const projectInfo = context.projectType ? `\n- Project Type: ${context.projectType}` : '';
  
  let historySection = "";
  if (history.length > 0) {
    historySection = "Recent Command History (oldest first):\n";
    history.forEach((cmd, index) => {
      historySection += `${index + 1}. ${cmd.command}\n`;
    });
    historySection += "\n";
  }
  
  return `${historySection}Current Command: ${currentCommand}

Output:
${currentOutput || "(no output)"}

Environment:
- Shell: ${context.shell}
- OS: ${context.os}
- Working Directory: ${context.cwd}${projectInfo}

Analyze this command and its output. Use the command history for context about what the user was trying to accomplish. Explain what happened and suggest a follow-up action if appropriate.`;
}

