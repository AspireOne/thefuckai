import chalk from "chalk";

/**
 * Warm Pastel Palette
 * Central source of truth for all application colors.
 */
export const COLORS = {
  lavender: "#B5B9FF", // Primary brand color
  peach: "#FFB0B0",    // Secondary/Accent color
  sage: "#A8D8B9",     // Success/Positive action
  coral: "#FF9999",    // Error/Destructive action
  sand: "#E8D0B0",     // Warning/Caution
  taupe: "#C0B0A0",    // Muted text/Explanations
  charcoal: "#404040", // Dark text (reserved)
  offWhite: "#F0F0F0", // Light text (default)
};

/**
 * Semantic Theme Definitions
 * Maps specific UI elements to their corresponding styles using the palette.
 * Use these exports in components instead of raw colors.
 */
export const theme = {
  // --- Global Roles ---
  primary: chalk.hex(COLORS.lavender),
  secondary: chalk.hex(COLORS.peach),
  success: chalk.hex(COLORS.sage),
  error: chalk.hex(COLORS.coral),
  warning: chalk.hex(COLORS.sand),
  muted: chalk.hex(COLORS.taupe),
  text: chalk.white,
  
  // --- Component Specifics ---
  
  // The big "thefuckai" banner (unused if we go minimal)
  header: chalk.hex(COLORS.lavender).bold,
  
  // The suggested command to run (e.g. `git push`)
  command: chalk.hex(COLORS.lavender).bold,
  
  // The AI's explanation text
  explanation: chalk.hex(COLORS.taupe),
  
  // "Suggested fix:" label
  suggestionLabel: chalk.hex(COLORS.peach).bold,
  
  // --- Animation Colors ---
  // Glitch characters in the loading animation
  glitch1: chalk.hex(COLORS.peach),
  glitch2: chalk.hex(COLORS.lavender),
  // Base text color for "Analyzing..."
  glitchBase: chalk.hex(COLORS.taupe),
};
