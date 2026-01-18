import { theme } from "./theme.js";

/**
 * Creates a "hacking" style animated text where random characters glitch
 * Refined for subtlety and elegance
 */
export function createHackingAnimation(text: string): {
  start: () => void;
  stop: () => void;
} {
  const glitchChars = ['#', '$', '%', '*', '?', '~', '^', '+', '=', ':'];
  let interval: NodeJS.Timeout | null = null;
  let isRunning = false;
  
  const originalText = text;
  const textArray = text.split('');
  
  function glitchText(): string {
    return textArray.map((char, i) => {
      // Skip spaces
      if (char === ' ') return ' ';
      
      // Random chance to glitch (much lower probability for subtlety: 5%)
      if (Math.random() < 0.05) {
        // Use theme colors for glitches
        return Math.random() > 0.5 
          ? theme.glitch1(glitchChars[Math.floor(Math.random() * glitchChars.length)]!)
          : theme.glitch2(glitchChars[Math.floor(Math.random() * glitchChars.length)]!);
      }
      
      // Base text color
      return theme.glitchBase(char);
    }).join('');
  }
  
  function render() {
    if (!isRunning) return;
    
    // Clear line and print glitched text
    process.stdout.write('\r' + glitchText());
  }
  
  return {
    start() {
      if (isRunning) return;
      isRunning = true;
      
      // Print initial state
      process.stdout.write(theme.glitchBase(originalText));
      
      // Start glitching at slower intervals (120ms) for elegance
      interval = setInterval(render, 120);
    },
    
    stop() {
      if (!isRunning) return;
      isRunning = false;
      
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      
      // Clear the line
      process.stdout.write('\r' + ' '.repeat(originalText.length) + '\r');
    },
  };
}
