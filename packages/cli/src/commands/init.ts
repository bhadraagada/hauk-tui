import { Command } from "commander";
import * as p from "@clack/prompts";
import path from "node:path";
import fs from "fs-extra";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { getDefaultConfig, writeConfig, isInitialized } from "../utils/config.js";
import { logger } from "../utils/logger.js";

const execAsync = promisify(exec);

export const initCommand = new Command()
  .name("init")
  .description("Initialize haukTUI in your project")
  .option("-y, --yes", "Skip prompts and use defaults")
  .option("-c, --cwd <path>", "Working directory", process.cwd())
  .action(async (options) => {
    const cwd = options.cwd as string;

    p.intro("🖥️  haukTUI Setup");

    // Check if already initialized
    if (await isInitialized(cwd)) {
      const shouldContinue = await p.confirm({
        message: "haukTUI is already initialized. Reinitialize?",
        initialValue: false,
      });

      if (p.isCancel(shouldContinue) || !shouldContinue) {
        p.cancel("Initialization cancelled.");
        process.exit(0);
      }
    }

    let config = getDefaultConfig();

    if (!options.yes) {
      const componentDir = await p.text({
        message: "Where would you like to store components?",
        initialValue: config.componentDir,
        placeholder: "src/tui/components",
      });

      if (p.isCancel(componentDir)) {
        p.cancel("Initialization cancelled.");
        process.exit(0);
      }

      config.componentDir = componentDir as string;
    }

    const s = p.spinner();

    // Create directory structure
    s.start("Creating directory structure...");
    const componentDir = path.join(cwd, config.componentDir);
    await fs.ensureDir(componentDir);
    s.stop("Directory structure created");

    // Write config file
    s.start("Writing configuration...");
    await writeConfig(config, cwd);
    s.stop("Configuration saved");

    // Create tokens file
    s.start("Creating tokens file...");
    const tokensDir = path.dirname(path.join(cwd, config.tokensPath ?? "src/tui/tokens.ts"));
    await fs.ensureDir(tokensDir);
    
    const tokensContent = `// haukTUI tokens configuration
// Customize your terminal UI theme here

import { createTokens, type TokenOverrides } from "@hauktui/tokens";

const customTokens: TokenOverrides = {
  // Override default colors here
  // colors: {
  //   accent: "#8b5cf6", // violet
  // },
};

export const tokens = createTokens(customTokens);
`;
    
    await fs.writeFile(
      path.join(cwd, config.tokensPath ?? "src/tui/tokens.ts"),
      tokensContent
    );
    s.stop("Tokens file created");

    // Detect package manager and install dependencies
    s.start("Installing dependencies...");
    
    let packageManager = "npm";
    if (await fs.pathExists(path.join(cwd, "pnpm-lock.yaml"))) {
      packageManager = "pnpm";
    } else if (await fs.pathExists(path.join(cwd, "yarn.lock"))) {
      packageManager = "yarn";
    } else if (await fs.pathExists(path.join(cwd, "bun.lockb"))) {
      packageManager = "bun";
    }

    const deps = ["@hauktui/tokens", "@hauktui/core", "@hauktui/primitives-ink", "ink", "react"];
    const installCmd = packageManager === "npm" 
      ? `npm install ${deps.join(" ")}`
      : packageManager === "yarn"
      ? `yarn add ${deps.join(" ")}`
      : packageManager === "bun"
      ? `bun add ${deps.join(" ")}`
      : `pnpm add ${deps.join(" ")}`;

    try {
      await execAsync(installCmd, { cwd });
      s.stop("Dependencies installed");
    } catch (error) {
      s.stop("Failed to install dependencies");
      logger.warn(`Run manually: ${installCmd}`);
    }

    p.outro("✨ haukTUI initialized! Run `hauktui add button` to add your first component.");
  });
