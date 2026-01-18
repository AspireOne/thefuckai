import { z } from "zod";

// Response schema for the AI analysis
export const analysisResponseSchema = z.object({
  explanation: z
    .string()
    .describe(
      "Clear, helpful explanation of what happened. Interpret the output, diagnose issues, and provide context.",
    ),
  suggestedCommand: z
    .string()
    .nullable()
    .describe(
      "A follow-up command the user could run, if applicable. Could be a fix, a next step, or a diagnostic command. Pass null if no command is suggested",
    ),
});

export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;
