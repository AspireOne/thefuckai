import { z } from "zod";

// Response schema for the AI analysis
export const analysisResponseSchema = z.object({
  explanation: z.string().describe("Clear explanation of what went wrong and why"),
  suggestedCommand: z.string().optional().describe("Corrected command to run, if a fix is possible"),
  confidence: z.enum(["high", "medium", "low"]).optional().describe("Confidence level in the suggested fix"),
});

export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;
