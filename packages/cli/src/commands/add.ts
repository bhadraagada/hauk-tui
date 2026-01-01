import { Command } from "commander";
import * as p from "@clack/prompts";
import path from "node:path";
import fs from "fs-extra";
import { getComponent } from "@hauktui/registry";
import {
  readConfig,
  readLockFile,
  writeLockFile,
  getComponentPath,
  isInitialized,
} from "../utils/config.js";
import {
  fetchComponentFiles,
  hashFile,
  validateComponents,
  getAvailableComponents,
} from "../utils/registry.js";
import { logger, highlight } from "../utils/logger.js";

export const addCommand = new Command()
  .name("add")
  .description("Add components to your project")
  .argument("[components...]", "Components to add")
  .option("-a, --all", "Install all available components")
  .option("-y, --yes", "Skip confirmation prompts")
  .option("-o, --overwrite", "Overwrite existing files")
  .option("-c, --cwd <path>", "Working directory", process.cwd())
  .action(async (components: string[], options) => {
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

    // If --all flag is provided, get all available components
    let selectedComponents = components;
    if (options.all) {
      selectedComponents = getAvailableComponents();
      logger.info(`Installing all ${selectedComponents.length} components...`);
    } else if (selectedComponents.length === 0) {
      // If no components specified, prompt for selection
      const available = getAvailableComponents();
      const selected = await p.multiselect({
        message: "Select components to add:",
        options: available.map((name) => {
          const meta = getComponent(name);
          const option: { value: string; label: string; hint?: string } = {
            value: name,
            label: name,
          };
          if (meta?.description) {
            option.hint = meta.description;
          }
          return option;
        }),
      });

      if (p.isCancel(selected)) {
        p.cancel("Operation cancelled.");
        process.exit(0);
      }

      selectedComponents = selected as string[];
    }

    if (selectedComponents.length === 0) {
      logger.warn("No components selected.");
      process.exit(0);
    }

    // Validate component names
    const { valid, invalid } = validateComponents(selectedComponents);

    if (invalid.length > 0) {
      logger.error(`Unknown components: ${invalid.join(", ")}`);
      logger.info(`Available: ${getAvailableComponents().join(", ")}`);
      process.exit(1);
    }

    const s = p.spinner();
    const lockFile = await readLockFile(cwd);
    let addedCount = 0;

    for (const meta of valid) {
      s.start(`Adding ${highlight(meta.name)}...`);

      const targetDir = getComponentPath(config, meta.name, cwd);

      // Check if component already exists
      if (await fs.pathExists(targetDir)) {
        if (!options.overwrite) {
          const existingEntry = lockFile.components[meta.name];
          if (existingEntry) {
            s.stop(
              `${meta.name} already installed (v${existingEntry.version})`
            );
            continue;
          }

          if (!options.yes) {
            s.stop();
            const overwrite = await p.confirm({
              message: `${meta.name} already exists. Overwrite?`,
              initialValue: false,
            });

            if (p.isCancel(overwrite) || !overwrite) {
              continue;
            }
            s.start(`Adding ${highlight(meta.name)}...`);
          }
        }
      }

      // Fetch component files
      const files = await fetchComponentFiles(meta.name);
      if (!files) {
        s.stop(`Failed to fetch ${meta.name}`);
        continue;
      }

      // Create component directory
      await fs.ensureDir(targetDir);

      // Write files and calculate hashes
      const fileHashes: Record<string, string> = {};
      for (const [filename, content] of files) {
        const filePath = path.join(targetDir, filename);
        await fs.writeFile(filePath, content);
        fileHashes[filename] = hashFile(content);
      }

      // Update lock file
      lockFile.components[meta.name] = {
        name: meta.name,
        version: meta.version,
        files: fileHashes,
        installedAt: new Date().toISOString(),
      };

      addedCount++;
      s.stop(`Added ${highlight(meta.name)}`);

      // Show notes if any
      if (meta.notes) {
        logger.info(`  └─ ${meta.notes}`);
      }
    }

    // Save lock file
    await writeLockFile(lockFile, cwd);

    logger.break();
    if (addedCount > 0) {
      logger.success(
        `Added ${addedCount} component(s) to ${config.componentDir}`
      );
    } else {
      logger.info("No components were added.");
    }
  });
