/**
 * Registry component metadata
 */
export interface ComponentMeta {
  /** Unique component name */
  name: string;
  /** Human-readable description */
  description: string;
  /** Component version */
  version: string;
  /** Files to copy (relative to component directory) */
  files: string[];
  /** NPM dependencies required */
  dependencies: Record<string, string>;
  /** haukTUI package dependencies */
  hauktuiDependencies: string[];
  /** Post-install notes/instructions */
  notes?: string;
  /** Component category */
  category: ComponentCategory;
  /** Tags for searchability */
  tags: string[];
}

/**
 * Component categories
 */
export type ComponentCategory =
  | "primitive"
  | "input"
  | "layout"
  | "feedback"
  | "navigation"
  | "pattern"
  | "display";

/**
 * Complete registry manifest
 */
export interface Registry {
  /** Schema version */
  version: string;
  /** Base URL for remote fetching */
  baseUrl?: string;
  /** All available components */
  components: ComponentMeta[];
}

/**
 * Lock file entry for installed component
 */
export interface LockEntry {
  /** Component name */
  name: string;
  /** Installed version */
  version: string;
  /** File hashes for change detection */
  files: Record<string, string>;
  /** Installation timestamp */
  installedAt: string;
}

/**
 * Lock file structure
 */
export interface LockFile {
  /** Lock file version */
  version: string;
  /** Installed components */
  components: Record<string, LockEntry>;
}

/**
 * User configuration file
 */
export interface HaukConfig {
  /** Schema version */
  $schema?: string;
  /** Target directory for components */
  componentDir: string;
  /** Token overrides file path */
  tokensPath?: string;
  /** Registry URL (for remote fetching) */
  registryUrl?: string;
  /** Aliases for import paths */
  aliases?: Record<string, string>;
}
