import type { ColorDepth, TerminalCapabilities } from "./types";

/**
 * Detect terminal color depth based on environment variables
 */
function detectColorDepth(): ColorDepth {
  // Check for forced color settings
  const forceColor = process.env["FORCE_COLOR"];
  if (forceColor === "0") return "none";
  if (forceColor === "1") return "16";
  if (forceColor === "2") return "256";
  if (forceColor === "3") return "truecolor";

  // Check for NO_COLOR standard
  if (process.env["NO_COLOR"] !== undefined) return "none";

  // Check for 24-bit/truecolor support
  const colorTerm = process.env["COLORTERM"];
  if (colorTerm === "truecolor" || colorTerm === "24bit") {
    return "truecolor";
  }

  // Check TERM variable
  const term = process.env["TERM"] ?? "";

  if (term.includes("256color") || term.includes("256")) {
    return "256";
  }

  if (term.includes("color") || term.includes("xterm") || term.includes("screen") || term.includes("vt100")) {
    return "16";
  }

  // Windows Terminal and modern terminals
  if (process.env["WT_SESSION"] !== undefined) {
    return "truecolor";
  }

  // iTerm
  if (process.env["TERM_PROGRAM"] === "iTerm.app") {
    return "truecolor";
  }

  // VS Code integrated terminal
  if (process.env["TERM_PROGRAM"] === "vscode") {
    return "truecolor";
  }

  // Apple Terminal
  if (process.env["TERM_PROGRAM"] === "Apple_Terminal") {
    return "256";
  }

  // Fallback: if we have a TTY, assume basic color support
  if (process.stdout.isTTY) {
    return "16";
  }

  return "none";
}

/**
 * Detect Unicode support in the terminal
 */
function detectUnicodeSupport(): boolean {
  // Check explicit environment variable
  const unicodeEnv = process.env["HAUKTUI_UNICODE"];
  if (unicodeEnv === "0" || unicodeEnv === "false") return false;
  if (unicodeEnv === "1" || unicodeEnv === "true") return true;

  // Check for common Unicode-supporting environments
  const lang = process.env["LANG"] ?? "";
  const lcAll = process.env["LC_ALL"] ?? "";

  if (lang.includes("UTF-8") || lang.includes("utf8") || lcAll.includes("UTF-8") || lcAll.includes("utf8")) {
    return true;
  }

  // Windows Terminal supports Unicode
  if (process.env["WT_SESSION"] !== undefined) {
    return true;
  }

  // Most modern terminals support Unicode
  const term = process.env["TERM"] ?? "";
  if (term.includes("xterm") || term.includes("screen") || term.includes("vt100")) {
    return true;
  }

  // Default to true on modern systems
  return process.platform !== "win32" || process.env["WT_SESSION"] !== undefined;
}

/**
 * Detect hyperlink support in the terminal
 */
function detectHyperlinkSupport(): boolean {
  // Check explicit environment variable
  const hyperlinkEnv = process.env["HAUKTUI_HYPERLINKS"];
  if (hyperlinkEnv === "0" || hyperlinkEnv === "false") return false;
  if (hyperlinkEnv === "1" || hyperlinkEnv === "true") return true;

  // Known supporting terminals
  if (process.env["WT_SESSION"] !== undefined) return true;
  if (process.env["TERM_PROGRAM"] === "iTerm.app") return true;
  if (process.env["TERM_PROGRAM"] === "vscode") return true;
  if (process.env["TERM_PROGRAM"] === "Hyper") return true;
  if (process.env["KONSOLE_VERSION"] !== undefined) return true;

  return false;
}

/**
 * Detect if running in a CI environment
 */
function detectCI(): boolean {
  return (
    process.env["CI"] !== undefined ||
    process.env["CONTINUOUS_INTEGRATION"] !== undefined ||
    process.env["GITHUB_ACTIONS"] !== undefined ||
    process.env["GITLAB_CI"] !== undefined ||
    process.env["CIRCLECI"] !== undefined ||
    process.env["TRAVIS"] !== undefined ||
    process.env["JENKINS_URL"] !== undefined ||
    process.env["BUILD_NUMBER"] !== undefined
  );
}

/**
 * Detect terminal capabilities
 * @returns TerminalCapabilities object with detected values
 */
export function detectTerminalCapabilities(): TerminalCapabilities {
  const isInteractive = Boolean(process.stdout.isTTY && process.stdin.isTTY);

  return {
    colorDepth: detectColorDepth(),
    unicode: detectUnicodeSupport(),
    hyperlinks: detectHyperlinkSupport(),
    columns: process.stdout.columns ?? 80,
    rows: process.stdout.rows ?? 24,
    isCI: detectCI(),
    isInteractive,
  };
}

/**
 * Check if the terminal supports a minimum color depth
 */
export function supportsColor(minDepth: ColorDepth = "16"): boolean {
  const depth = detectColorDepth();
  const order: ColorDepth[] = ["none", "16", "256", "truecolor"];
  return order.indexOf(depth) >= order.indexOf(minDepth);
}

/**
 * Check if the terminal is interactive (has TTY)
 */
export function isInteractive(): boolean {
  return Boolean(process.stdout.isTTY && process.stdin.isTTY);
}
