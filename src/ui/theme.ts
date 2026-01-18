import chalk from "chalk";

/**
 * Anthropic-Inspired Palette
 * Sophisticated, warm, and professional.
 */
export const COLORS = {
  stone: "#F5F2E8",   // Warmest White / Base
  warmGray: "#9E9A95", // Muted text / Labels
  text: "#E3DCD2",    // Main reading text (Warm Off-White)
  coral: "#D97757",   // Primary Accent (Anthropic-like orange/coral) - Highlights
  maple: "#C8A682",   // Secondary Accent - Interactions
  olive: "#8E9C6D",   // Success
  sienna: "#C1554D",  // Error
  charcoal: "#2D2B29", // Dark background text if needed
};

/**
 * Semantic Theme Definitions
 */
export const theme = {
  // --- Global Roles ---
  primary: chalk.hex(COLORS.coral),
  secondary: chalk.hex(COLORS.maple),
  success: chalk.hex(COLORS.olive),
  error: chalk.hex(COLORS.sienna),
  warning: chalk.hex(COLORS.maple), // Maple works well for warning too
  muted: chalk.hex(COLORS.warmGray),
  text: chalk.hex(COLORS.text),
  
  // --- Component Specifics ---
  
  // Header / Branding
  header: chalk.hex(COLORS.coral).bold,
  
  // The suggested command to run
  command: chalk.hex(COLORS.stone).bold, // Bright, distinct
  
  // The AI's explanation text
  explanation: chalk.hex(COLORS.text),
  
  // "Suggested fix:" label - subtle yet clear
  suggestionLabel: chalk.hex(COLORS.maple).bold,
  
  // Confidence levels
  confidenceHigh: chalk.hex(COLORS.olive),
  confidenceMedium: chalk.hex(COLORS.maple),
  confidenceLow: chalk.hex(COLORS.sienna),
  
  // --- Animation Colors ---
  // Glitch characters
  glitch1: chalk.hex(COLORS.coral),
  glitch2: chalk.hex(COLORS.maple),
  // Base text for "Analyzing..."
  glitchBase: chalk.hex(COLORS.warmGray),
};
