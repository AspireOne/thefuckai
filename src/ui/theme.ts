import chalk from "chalk";

// Warm Pastel Palette
export const COLORS = {
  lavender: "#B5B9FF", // Primary
  peach: "#FFB0B0",    // Secondary/Accent
  sage: "#A8D8B9",     // Success
  coral: "#FF9999",    // Error
  sand: "#E8D0B0",     // Warning
  taupe: "#C0B0A0",    // Muted/Explanation
  charcoal: "#404040", // Dark text if needed
  offWhite: "#F0F0F0", // Light text
};

export const theme = {
  // Base roles
  primary: chalk.hex(COLORS.lavender),
  secondary: chalk.hex(COLORS.peach),
  success: chalk.hex(COLORS.sage),
  error: chalk.hex(COLORS.coral),
  warning: chalk.hex(COLORS.sand),
  muted: chalk.hex(COLORS.taupe),
  text: chalk.white,
  
  // Specific usages
  header: chalk.hex(COLORS.lavender).bold,
  command: chalk.hex(COLORS.lavender).bold,
  explanation: chalk.hex(COLORS.taupe),
  suggestionLabel: chalk.hex(COLORS.peach).bold,
  confidenceHigh: chalk.hex(COLORS.sage),
  confidenceMedium: chalk.hex(COLORS.sand),
  confidenceLow: chalk.hex(COLORS.coral),
  
  // Animation
  glitch1: chalk.hex(COLORS.peach),
  glitch2: chalk.hex(COLORS.lavender),
  glitchBase: chalk.hex(COLORS.taupe),
};
