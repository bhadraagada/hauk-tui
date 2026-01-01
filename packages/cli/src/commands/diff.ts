import { Command } from "commander";
import path from "node:path";
import fs from "fs-extra";
import pc from "picocolors";
import { getComponent } from "@hauktui/registry";
import {
  readConfig,
  readLockFile,
  getComponentPath,
  isInitialized,
} from "../utils/config.js";
import { fetchComponentFiles, hashFile } from "../utils/registry.js";
import { logger, highlight } from "../utils/logger.js";

export const diffCommand = new Command()
  .name("diff")
  .description("Show differences between local and upstream components")
  .argument("<component>", "Component to diff")
  .option("-c, --cwd <path>", "Working directory", process.cwd())
  .action(async (componentName: string, options) => {
    const cwd = options.cwd as string;

    // Check if initialized
    if (!(await isInitialized(cwd))) {
      logger.error("Project not initialized. Run `hauktui init` first.");
      process.exit(1);
    }

    const config = await readConfig(cwd);
    if (!config) {
      logger.error("Could not read hauk.config.json");
      process.exit(1);
    }

    const meta = getComponent(componentName);
    if (!meta) {
      logger.error(`Component "${componentName}" not found in registry.`);
      process.exit(1);
    }

    const lockFile = await readLockFile(cwd);
    const installed = lockFile.components[componentName];

    if (!installed) {
      logger.error(`Component "${componentName}" is not installed.`);
      process.exit(1);
    }

    const componentDir = getComponentPath(config, componentName, cwd);
    
    if (!(await fs.pathExists(componentDir))) {
      logger.error(`Component directory not found: ${componentDir}`);
      process.exit(1);
    }

    // Fetch upstream files
    const upstreamFiles = await fetchComponentFiles(componentName);
    if (!upstreamFiles) {
      logger.error("Failed to fetch upstream component.");
      process.exit(1);
    }

    logger.break();
    logger.log(`Comparing ${highlight(componentName)} (local v${installed.version} ↔ upstream v${meta.version})`);
    logger.break();

    let hasChanges = false;

    for (const [filename, upstreamContent] of upstreamFiles) {
      const localPath = path.join(componentDir, filename);
      const localExists = await fs.pathExists(localPath);

      if (!localExists) {
        logger.log(`${pc.red("- " + filename)} ${pc.dim("(missing locally)")}`);
        hasChanges = true;
        continue;
      }

      const localContent = await fs.readFile(localPath, "utf-8");
      const localHash = hashFile(localContent);
      const upstreamHash = hashFile(upstreamContent);
      const installedHash = installed.files[filename];

      if (localHash === upstreamHash) {
        logger.log(`${pc.green("✓ " + filename)} ${pc.dim("(unchanged)")}`);
      } else if (localHash === installedHash) {
        logger.log(`${pc.yellow("↑ " + filename)} ${pc.dim("(upstream updated)")}`);
        hasChanges = true;
      } else if (upstreamHash === installedHash) {
        logger.log(`${pc.blue("● " + filename)} ${pc.dim("(local modifications)")}`);
        hasChanges = true;
      } else {
        logger.log(`${pc.magenta("⚡ " + filename)} ${pc.dim("(both modified)")}`);
        hasChanges = true;
      }
    }

    // Check for extra local files
    const localFiles = await fs.readdir(componentDir);
    for (const file of localFiles) {
      if (!upstreamFiles.has(file)) {
        logger.log(`${pc.cyan("+ " + file)} ${pc.dim("(local only)")}`);
        hasChanges = true;
      }
    }

    logger.break();
    if (!hasChanges) {
      logger.success("No differences found.");
    } else {
      logger.info("Run `hauktui add --overwrite " + componentName + "` to update.");
    }
  });
