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
import { fetchComponentFiles, hashFile } from "../utils/registry.js";
import { logger, highlight } from "../utils/logger.js";

interface UpdateCandidate {
  name: string;
  installedVersion: string;
  latestVersion: string;
  hasLocalChanges: boolean;
}

export const updateCommand = new Command()
  .name("update")
  .description("Update installed components to latest versions")
  .argument("[components...]", "Components to update (default: all)")
  .option("-y, --yes", "Skip confirmation prompts")
  .option("-f, --force", "Force update even with local modifications")
  .option("--check", "Only check for updates without applying")
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

    const lockFile = await readLockFile(cwd);
    const installedComponents = Object.keys(lockFile.components);

    if (installedComponents.length === 0) {
      logger.info("No components installed.");
      process.exit(0);
    }

    // Determine which components to check
    let componentsToCheck = components.length > 0 ? components : installedComponents;

    // Validate that specified components are installed
    const notInstalled = componentsToCheck.filter((c) => !lockFile.components[c]);
    if (notInstalled.length > 0) {
      logger.error(`Not installed: ${notInstalled.join(", ")}`);
      process.exit(1);
    }

    const s = p.spinner();
    s.start("Checking for updates...");

    const candidates: UpdateCandidate[] = [];

    for (const componentName of componentsToCheck) {
      const installed = lockFile.components[componentName];
      if (!installed) continue;

      const meta = getComponent(componentName);
      if (!meta) {
        logger.warn(`Component "${componentName}" not found in registry.`);
        continue;
      }

      const componentDir = getComponentPath(config, componentName, cwd);

      // Check if there are local modifications
      let hasLocalChanges = false;
      if (await fs.pathExists(componentDir)) {
        for (const [filename, installedHash] of Object.entries(installed.files)) {
          const filePath = path.join(componentDir, filename);
          if (await fs.pathExists(filePath)) {
            const localContent = await fs.readFile(filePath, "utf-8");
            const localHash = hashFile(localContent);
            if (localHash !== installedHash) {
              hasLocalChanges = true;
              break;
            }
          }
        }
      }

      // Check if there's a new version available
      if (meta.version !== installed.version) {
        candidates.push({
          name: componentName,
          installedVersion: installed.version,
          latestVersion: meta.version,
          hasLocalChanges,
        });
      }
    }

    s.stop();

    if (candidates.length === 0) {
      logger.success("All components are up to date!");
      process.exit(0);
    }

    // Display update candidates
    logger.break();
    logger.log("Updates available:");
    logger.break();

    for (const candidate of candidates) {
      const versionInfo = `${candidate.installedVersion} → ${candidate.latestVersion}`;
      const localChangeWarning = candidate.hasLocalChanges
        ? " (has local modifications)"
        : "";

      logger.log(
        `  ${highlight(candidate.name)} ${versionInfo}${localChangeWarning}`
      );
    }

    logger.break();

    // Check-only mode
    if (options.check) {
      logger.info(`${candidates.length} update(s) available.`);
      logger.info("Run `hauktui update` to apply updates.");
      process.exit(0);
    }

    // Components with local changes
    const withLocalChanges = candidates.filter((c) => c.hasLocalChanges);
    if (withLocalChanges.length > 0 && !options.force) {
      logger.warn(
        `${withLocalChanges.length} component(s) have local modifications.`
      );
      logger.info("Use --force to overwrite, or update individually.");
      
      // Filter out components with local changes
      const safeToUpdate = candidates.filter((c) => !c.hasLocalChanges);
      if (safeToUpdate.length === 0) {
        process.exit(0);
      }

      if (!options.yes) {
        const proceed = await p.confirm({
          message: `Update ${safeToUpdate.length} component(s) without local changes?`,
          initialValue: true,
        });

        if (p.isCancel(proceed) || !proceed) {
          p.cancel("Update cancelled.");
          process.exit(0);
        }
      }

      // Update only safe components
      await performUpdates(safeToUpdate, config, lockFile, cwd);
    } else {
      // Confirm update
      if (!options.yes) {
        const proceed = await p.confirm({
          message: `Update ${candidates.length} component(s)?`,
          initialValue: true,
        });

        if (p.isCancel(proceed) || !proceed) {
          p.cancel("Update cancelled.");
          process.exit(0);
        }
      }

      await performUpdates(candidates, config, lockFile, cwd);
    }

    // Save lock file
    await writeLockFile(lockFile, cwd);

    logger.break();
    logger.success("Update complete!");
  });

async function performUpdates(
  candidates: UpdateCandidate[],
  config: { componentDir: string },
  lockFile: { components: Record<string, unknown> },
  cwd: string
): Promise<void> {
  const s = p.spinner();

  for (const candidate of candidates) {
    s.start(`Updating ${highlight(candidate.name)}...`);

    const meta = getComponent(candidate.name);
    if (!meta) {
      s.stop(`Skipped ${candidate.name} (not in registry)`);
      continue;
    }

    const targetDir = getComponentPath(config, candidate.name, cwd);

    // Fetch latest files
    const files = await fetchComponentFiles(candidate.name);
    if (!files) {
      s.stop(`Failed to fetch ${candidate.name}`);
      continue;
    }

    // Create component directory if needed
    await fs.ensureDir(targetDir);

    // Write files and calculate hashes
    const fileHashes: Record<string, string> = {};
    for (const [filename, content] of files) {
      const filePath = path.join(targetDir, filename);
      await fs.writeFile(filePath, content);
      fileHashes[filename] = hashFile(content);
    }

    // Update lock file entry
    (lockFile.components as Record<string, unknown>)[candidate.name] = {
      name: candidate.name,
      version: meta.version,
      files: fileHashes,
      installedAt: new Date().toISOString(),
    };

    s.stop(
      `Updated ${highlight(candidate.name)} (${candidate.installedVersion} → ${candidate.latestVersion})`
    );
  }
}
