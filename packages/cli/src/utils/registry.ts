import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import pc from "picocolors";
import { getComponent, getComponents } from "@hauktui/registry";
import type { ComponentMeta } from "@hauktui/registry";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Calculate file hash for change detection
 */
export function hashFile(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex").slice(0, 16);
}

/**
 * Get component source from registry package
 */
export function getComponentSource(componentName: string): string {
  // In bundled mode, we need to find the registry package components
  // __dirname is packages/cli/dist (or packages/cli/src when running with ts)
  // Go up: dist -> cli -> packages -> then into packages/registry/components
  const packagesDir = path.resolve(__dirname, "..", "..", "..");
  const registryComponents = path.resolve(packagesDir, "packages", "registry", "components");
  return path.join(registryComponents, componentName);
}

/**
 * Fetch component files (local bundled mode)
 */
export async function fetchComponentFiles(
  componentName: string
): Promise<Map<string, string> | null> {
  const meta = getComponent(componentName);
  if (!meta) {
    return null;
  }

  const sourcePath = getComponentSource(componentName);
  const files = new Map<string, string>();

  for (const file of meta.files) {
    const filePath = path.join(sourcePath, file);
    if (await fs.pathExists(filePath)) {
      const content = await fs.readFile(filePath, "utf-8");
      files.set(file, content);
    }
  }

  return files;
}

/**
 * Try to fetch from remote, fall back to bundled
 */
export async function fetchComponentFilesWithFallback(
  componentName: string,
  registryUrl?: string
): Promise<{ files: Map<string, string>; source: "remote" | "bundled" } | null> {
  // For now, always use bundled (remote fetching can be added later)
  const files = await fetchComponentFiles(componentName);
  if (!files) {
    return null;
  }
  return { files, source: "bundled" };
}

/**
 * Get all available component names
 */
export function getAvailableComponents(): string[] {
  return getComponents().map((c) => c.name);
}

/**
 * Validate component names
 */
export function validateComponents(names: string[]): {
  valid: ComponentMeta[];
  invalid: string[];
} {
  const valid: ComponentMeta[] = [];
  const invalid: string[] = [];

  for (const name of names) {
    const meta = getComponent(name);
    if (meta) {
      valid.push(meta);
    } else {
      invalid.push(name);
    }
  }

  return { valid, invalid };
}

/**
 * Format component info for display
 */
export function formatComponentInfo(meta: ComponentMeta): string {
  return `${pc.bold(meta.name)} ${pc.dim(`v${meta.version}`)}
  ${meta.description}
  ${pc.dim("Category:")} ${meta.category}
  ${pc.dim("Tags:")} ${meta.tags.join(", ")}
  ${pc.dim("Files:")} ${meta.files.join(", ")}
  ${meta.notes ? `${pc.dim("Note:")} ${meta.notes}` : ""}`;
}
