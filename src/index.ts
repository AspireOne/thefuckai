#!/usr/bin/env node
import { Command } from "commander";
import { loadConfig, validateConfig, CONFIG_FILE } from "./config.js";
import { analyzeCommandStream } from "./ai/index.js";
import { powershell, detectEnvironment } from "./shell/index.js";
import {
  printHeader,
  printSuggestion,
  printError,
  printWarning,
  printCommand,
  printVerbose,
  printStreamingExplanation,
  finalizeStreaming,
  confirmCommand,
  editCommand,
  runCommand,
} from "./ui/index.js";
import chalk from "chalk";

const program = new Command();

program
  .name("thefuckai")
  .description("AI-powered terminal assistant that explains errors and suggests fixes")
  .version("1.0.0");

program
  .option("-c, --command <command>", "The command that failed")
  .option("-o, --output <output>", "The output/error from the failed command")
  .option("-e, --explain", "Only explain the error, don't suggest commands")
  .option("-m, --model <model>", "Model to use (e.g., claude-sonnet-4-20250514, gpt-4o)")
  .option("-y, --yes", "Auto-run the suggested command without confirmation")
  .option("-v, --verbose", "Show verbose output")
  .option("--setup", "Show shell setup instructions")
  .action(async (options: {
    command?: string;
    output?: string;
    explain?: boolean;
    model?: string;
    yes?: boolean;
    verbose?: boolean;
    setup?: boolean;
  }) => {
    // Show setup instructions
    if (options.setup) {
      console.log(powershell.getSetupInstructions());
      return;
    }

    printHeader();

    // Load and validate config
    const configOverrides: Parameters<typeof loadConfig>[0] = {};
    if (options.model !== undefined) configOverrides.model = options.model;
    if (options.verbose !== undefined) configOverrides.verbose = options.verbose;
    if (options.yes !== undefined) configOverrides.confirmBeforeRun = !options.yes;
    
    const config = loadConfig(configOverrides);

    printVerbose(`Config: ${JSON.stringify(config, null, 2)}`, config.verbose);

    const validation = validateConfig(config);
    if (!validation.valid) {
      printError(validation.error!);
      console.log(`\nCreate a config file at ${CONFIG_FILE} or set the appropriate environment variable.`);
      console.log('\nExample config.json:');
      console.log(JSON.stringify({
        model: "claude-sonnet-4-20250514",
        apiKey: "your-api-key-here",
      }, null, 2));
      process.exit(1);
    }

    // Get command to analyze
    let command = options.command;
    let output = options.output ?? "";

    if (!command) {
      printVerbose("No command provided, checking shell history...", config.verbose);
      const lastCmd = await powershell.getLastCommand();
      
      if (lastCmd) {
        command = lastCmd.command;
        output = lastCmd.output;
        printCommand("Last command", command);
      } else {
        printWarning("No command provided and couldn't get last command from history.");
        console.log("\nUsage:");
        console.log("  thefuckai --command 'git pussh' --output 'error message'");
        console.log("\nOr set up the shell integration:");
        console.log("  thefuckai --setup");
        process.exit(1);
      }
    } else {
      printCommand("Analyzing", command);
    }

    if (output && config.verbose) {
      console.log("\nOutput:");
      console.log(output);
    }

    console.log(chalk.gray("\n🧠 Thinking...\n"));
    
    // Detect environment context
    const envContext = detectEnvironment();
    if (config.verbose) {
      printVerbose(`Environment: ${JSON.stringify(envContext, null, 2)}`, true);
    }
    
    try {
      const result = await analyzeCommandStream(command, output, config, envContext, {
        onExplanationUpdate: (text) => {
          // Stream using the polished UI function
          printStreamingExplanation(text);
        },
      });
      
      finalizeStreaming();
      console.log();

      // Handle suggestion
      if (result.suggestion && !options.explain) {
        printSuggestion(result.suggestion);

        // Ask for confirmation
        if (config.confirmBeforeRun) {
          const confirmation = await confirmCommand(result.suggestion.command);

          if (confirmation.action === "run") {
            await runCommand(result.suggestion.command);
          } else if (confirmation.action === "edit") {
            const edited = await editCommand(result.suggestion.command);
            if (edited) {
              await runCommand(edited);
            }
          }
        } else {
          // Auto-run (-y flag)
          await runCommand(result.suggestion.command);
        }
      }
    } catch (error) {
      finalizeStreaming(); // Reset streaming state
      
      const err = error as Error;
      printError(`Failed to analyze command: ${err.message}`);
      
      if (config.verbose && err.stack) {
        console.log(err.stack);
      }
      
      process.exit(1);
    }
  });

program.parse();
