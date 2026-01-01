import path from "node:path";
import fs from "fs-extra";
import type { HaukConfig, LockFile } from "@hauktui/registry";

const CONFIG_FILE = "hauk.config.json";
const LOCK_FILE = "hauk.lock.json";

/**
 * Get the default config
 */
export function getDefaultConfig(): HaukConfig {
  return {
    $schema: "https://hauktui.dev/schema/config.json",
    componentDir: "src/tui/components",
    tokensPath: "src/tui/tokens.ts",
    registryUrl: "https://raw.githubusercontent.com/hauktui/hauktui/main/packages/registry",
    aliases: {
      "@/tui": "./src/tui",
    },
  };
}

/**
 * Get the default lock file
 */
export function getDefaultLockFile(): LockFile {
  return {
    version: "1.0.0",
    components: {},
  };
}

/**
 * Check if project has been initialized
 */
export async function isInitialized(cwd: string = process.cwd()): Promise<boolean> {
  const configPath = path.join(cwd, CONFIG_FILE);
  return fs.pathExists(configPath);
}

/**
 * Read the config file
 */
export async function readConfig(cwd: string = process.cwd()): Promise<HaukConfig | null> {
  const configPath = path.join(cwd, CONFIG_FILE);
  if (!(await fs.pathExists(configPath))) {
    return null;
  }
  return fs.readJson(configPath) as Promise<HaukConfig>;
}

/**
 * Write the config file
 */
export async function writeConfig(config: HaukConfig, cwd: string = process.cwd()): Promise<void> {
  const configPath = path.join(cwd, CONFIG_FILE);
  await fs.writeJson(configPath, config, { spaces: 2 });
}

/**
 * Read the lock file
 */
export async function readLockFile(cwd: string = process.cwd()): Promise<LockFile> {
  const lockPath = path.join(cwd, LOCK_FILE);
  if (!(await fs.pathExists(lockPath))) {
    return getDefaultLockFile();
  }
  return fs.readJson(lockPath) as Promise<LockFile>;
}

/**
 * Write the lock file
 */
export async function writeLockFile(lockFile: LockFile, cwd: string = process.cwd()): Promise<void> {
  const lockPath = path.join(cwd, LOCK_FILE);
  await fs.writeJson(lockPath, lockFile, { spaces: 2 });
}

/**
 * Get the component directory path
 */
export function getComponentDir(config: HaukConfig, cwd: string = process.cwd()): string {
  return path.join(cwd, config.componentDir);
}

/**
 * Get the path for a specific component
 */
export function getComponentPath(
  config: HaukConfig,
  componentName: string,
  cwd: string = process.cwd()
): string {
  return path.join(getComponentDir(config, cwd), componentName);
}
