import { streamText, Output } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import type { Config } from "../config.js";
import { SYSTEM_PROMPT, formatUserMessage } from "./prompts.js";
import { analysisResponseSchema, type AnalysisResponse } from "./schema.js";

export interface CommandSuggestion {
  command: string;
  explanation: string;
  confidence: "high" | "medium" | "low";
}

export interface AnalysisResult {
  explanation: string;
  suggestion: CommandSuggestion | undefined;
}

function getModel(config: Config) {
  const modelName = config.model.includes("/") 
    ? config.model.split("/")[1]! 
    : config.model;
  
  switch (config.provider) {
    case "anthropic":
      return anthropic(modelName);
    case "openai":
      return openai(modelName);
    case "google":
      return google(modelName);
    default:
      return anthropic(modelName);
  }
}

export interface StreamCallbacks {
  onExplanationUpdate?: (text: string) => void;
  onComplete?: (result: AnalysisResult) => void;
  onError?: (error: Error) => void;
}

/**
 * Analyzes a command using streaming structured output.
 * Calls onExplanationUpdate as the explanation streams in.
 */
export async function analyzeCommandStream(
  command: string,
  output: string,
  config: Config,
  callbacks: StreamCallbacks = {}
): Promise<AnalysisResult> {
  const model = getModel(config);
  
  const { partialOutputStream } = streamText({
    model,
    system: SYSTEM_PROMPT,
    prompt: formatUserMessage(command, output),
    output: Output.object({ schema: analysisResponseSchema }),
  });

  let lastExplanation = "";
  let finalResponse: Partial<AnalysisResponse> = {};

  try {
    for await (const partial of partialOutputStream) {
      finalResponse = partial;
      
      // Stream explanation updates
      if (partial.explanation && partial.explanation !== lastExplanation) {
        lastExplanation = partial.explanation;
        callbacks.onExplanationUpdate?.(partial.explanation);
      }
    }
  } catch (error) {
    callbacks.onError?.(error as Error);
    throw error;
  }

  // Build final result
  const result: AnalysisResult = {
    explanation: finalResponse.explanation ?? "",
    suggestion: finalResponse.suggestedCommand 
      ? {
          command: finalResponse.suggestedCommand,
          explanation: "", // Explanation is in the main field
          confidence: finalResponse.confidence ?? "medium",
        }
      : undefined,
  };

  callbacks.onComplete?.(result);
  return result;
}

/**
 * Non-streaming version for simpler use cases.
 */
export async function analyzeCommand(
  command: string,
  output: string,
  config: Config
): Promise<AnalysisResult> {
  return analyzeCommandStream(command, output, config);
}
