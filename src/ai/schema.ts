import { z } from "zod";

// Response schema for the AI analysis
export const analysisResponseSchema = z.object({
  explanation: z.string().describe(
    "Clear, helpful explanation of what happened. Interpret the output, diagnose issues, and provide context."
  ),
  suggestedCommand: z.string().optional().describe(
    "A follow-up command the user could run, if applicable. Could be a fix, a next step, or a diagnostic command."
  ),
  confidence: z.enum(["high", "medium", "low"]).optional().describe(
    "How confident you are that the suggested command will help. Omit if no command is suggested."
  ),
});

export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;
