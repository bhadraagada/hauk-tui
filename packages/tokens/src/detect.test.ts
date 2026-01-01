import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  detectTerminalCapabilities,
  supportsColor,
  isInteractive,
} from "./detect";

// Store original process.env and process.stdout
const originalEnv = { ...process.env };
const originalStdout = { ...process.stdout };

describe("detectTerminalCapabilities", () => {
  beforeEach(() => {
    // Reset env before each test
    process.env = { ...originalEnv };
    // Reset stdout mocks
    Object.defineProperty(process.stdout, "isTTY", { value: true, writable: true });
    Object.defineProperty(process.stdin, "isTTY", { value: true, writable: true });
    Object.defineProperty(process.stdout, "columns", { value: 120, writable: true });
    Object.defineProperty(process.stdout, "rows", { value: 40, writable: true });
  });

  afterEach(() => {
    // Restore original env
    process.env = originalEnv;
  });

  describe("color depth detection", () => {
    it("should detect FORCE_COLOR=0 as none", () => {
      process.env["FORCE_COLOR"] = "0";
      const caps = detectTerminalCapabilities();
      expect(caps.colorDepth).toBe("none");
    });

    it("should detect FORCE_COLOR=1 as 16", () => {
      process.env["FORCE_COLOR"] = "1";
      const caps = detectTerminalCapabilities();
      expect(caps.colorDepth).toBe("16");
    });

    it("should detect FORCE_COLOR=2 as 256", () => {
      process.env["FORCE_COLOR"] = "2";
      const caps = detectTerminalCapabilities();
      expect(caps.colorDepth).toBe("256");
    });

    it("should detect FORCE_COLOR=3 as truecolor", () => {
      process.env["FORCE_COLOR"] = "3";
      const caps = detectTerminalCapabilities();
      expect(caps.colorDepth).toBe("truecolor");
    });

    it("should respect NO_COLOR standard", () => {
      process.env["NO_COLOR"] = "1";
      const caps = detectTerminalCapabilities();
      expect(caps.colorDepth).toBe("none");
    });

    it("should detect truecolor from COLORTERM=truecolor", () => {
      delete process.env["FORCE_COLOR"];
      delete process.env["NO_COLOR"];
      process.env["COLORTERM"] = "truecolor";
      const caps = detectTerminalCapabilities();
      expect(caps.colorDepth).toBe("truecolor");
    });

    it("should detect truecolor from COLORTERM=24bit", () => {
      delete process.env["FORCE_COLOR"];
      delete process.env["NO_COLOR"];
      process.env["COLORTERM"] = "24bit";
      const caps = detectTerminalCapabilities();
      expect(caps.colorDepth).toBe("truecolor");
    });

    it("should detect 256 from xterm-256color TERM", () => {
      delete process.env["FORCE_COLOR"];
      delete process.env["NO_COLOR"];
      delete process.env["COLORTERM"];
      process.env["TERM"] = "xterm-256color";
      const caps = detectTerminalCapabilities();
      expect(caps.colorDepth).toBe("256");
    });

    it("should detect 16 from xterm TERM", () => {
      delete process.env["FORCE_COLOR"];
      delete process.env["NO_COLOR"];
      delete process.env["COLORTERM"];
      process.env["TERM"] = "xterm";
      const caps = detectTerminalCapabilities();
      expect(caps.colorDepth).toBe("16");
    });

    it("should detect truecolor from Windows Terminal", () => {
      delete process.env["FORCE_COLOR"];
      delete process.env["NO_COLOR"];
      delete process.env["COLORTERM"];
      delete process.env["TERM"];
      process.env["WT_SESSION"] = "12345";
      const caps = detectTerminalCapabilities();
      expect(caps.colorDepth).toBe("truecolor");
    });

    it("should detect truecolor from iTerm", () => {
      delete process.env["FORCE_COLOR"];
      delete process.env["NO_COLOR"];
      delete process.env["COLORTERM"];
      delete process.env["TERM"];
      delete process.env["WT_SESSION"];
      process.env["TERM_PROGRAM"] = "iTerm.app";
      const caps = detectTerminalCapabilities();
      expect(caps.colorDepth).toBe("truecolor");
    });

    it("should detect truecolor from VS Code", () => {
      delete process.env["FORCE_COLOR"];
      delete process.env["NO_COLOR"];
      delete process.env["COLORTERM"];
      delete process.env["TERM"];
      delete process.env["WT_SESSION"];
      process.env["TERM_PROGRAM"] = "vscode";
      const caps = detectTerminalCapabilities();
      expect(caps.colorDepth).toBe("truecolor");
    });

    it("should detect 256 from Apple Terminal", () => {
      delete process.env["FORCE_COLOR"];
      delete process.env["NO_COLOR"];
      delete process.env["COLORTERM"];
      delete process.env["TERM"];
      delete process.env["WT_SESSION"];
      process.env["TERM_PROGRAM"] = "Apple_Terminal";
      const caps = detectTerminalCapabilities();
      expect(caps.colorDepth).toBe("256");
    });
  });

  describe("unicode detection", () => {
    it("should detect Unicode from HAUKTUI_UNICODE=1", () => {
      process.env["HAUKTUI_UNICODE"] = "1";
      const caps = detectTerminalCapabilities();
      expect(caps.unicode).toBe(true);
    });

    it("should disable Unicode from HAUKTUI_UNICODE=0", () => {
      process.env["HAUKTUI_UNICODE"] = "0";
      const caps = detectTerminalCapabilities();
      expect(caps.unicode).toBe(false);
    });

    it("should detect Unicode from LANG=en_US.UTF-8", () => {
      delete process.env["HAUKTUI_UNICODE"];
      process.env["LANG"] = "en_US.UTF-8";
      const caps = detectTerminalCapabilities();
      expect(caps.unicode).toBe(true);
    });

    it("should detect Unicode from LC_ALL=en_US.UTF-8", () => {
      delete process.env["HAUKTUI_UNICODE"];
      delete process.env["LANG"];
      process.env["LC_ALL"] = "en_US.UTF-8";
      const caps = detectTerminalCapabilities();
      expect(caps.unicode).toBe(true);
    });

    it("should detect Unicode from Windows Terminal", () => {
      delete process.env["HAUKTUI_UNICODE"];
      delete process.env["LANG"];
      delete process.env["LC_ALL"];
      process.env["WT_SESSION"] = "12345";
      const caps = detectTerminalCapabilities();
      expect(caps.unicode).toBe(true);
    });
  });

  describe("hyperlink detection", () => {
    it("should detect hyperlinks from HAUKTUI_HYPERLINKS=1", () => {
      process.env["HAUKTUI_HYPERLINKS"] = "1";
      const caps = detectTerminalCapabilities();
      expect(caps.hyperlinks).toBe(true);
    });

    it("should disable hyperlinks from HAUKTUI_HYPERLINKS=0", () => {
      process.env["HAUKTUI_HYPERLINKS"] = "0";
      const caps = detectTerminalCapabilities();
      expect(caps.hyperlinks).toBe(false);
    });

    it("should detect hyperlinks from Windows Terminal", () => {
      delete process.env["HAUKTUI_HYPERLINKS"];
      process.env["WT_SESSION"] = "12345";
      const caps = detectTerminalCapabilities();
      expect(caps.hyperlinks).toBe(true);
    });

    it("should detect hyperlinks from iTerm", () => {
      delete process.env["HAUKTUI_HYPERLINKS"];
      delete process.env["WT_SESSION"];
      process.env["TERM_PROGRAM"] = "iTerm.app";
      const caps = detectTerminalCapabilities();
      expect(caps.hyperlinks).toBe(true);
    });

    it("should detect hyperlinks from VS Code", () => {
      delete process.env["HAUKTUI_HYPERLINKS"];
      delete process.env["WT_SESSION"];
      process.env["TERM_PROGRAM"] = "vscode";
      const caps = detectTerminalCapabilities();
      expect(caps.hyperlinks).toBe(true);
    });

    it("should detect hyperlinks from Konsole", () => {
      delete process.env["HAUKTUI_HYPERLINKS"];
      delete process.env["WT_SESSION"];
      delete process.env["TERM_PROGRAM"];
      process.env["KONSOLE_VERSION"] = "210401";
      const caps = detectTerminalCapabilities();
      expect(caps.hyperlinks).toBe(true);
    });
  });

  describe("CI detection", () => {
    it("should detect CI from CI=true", () => {
      process.env["CI"] = "true";
      const caps = detectTerminalCapabilities();
      expect(caps.isCI).toBe(true);
    });

    it("should detect GitHub Actions", () => {
      delete process.env["CI"];
      process.env["GITHUB_ACTIONS"] = "true";
      const caps = detectTerminalCapabilities();
      expect(caps.isCI).toBe(true);
    });

    it("should detect GitLab CI", () => {
      delete process.env["CI"];
      delete process.env["GITHUB_ACTIONS"];
      process.env["GITLAB_CI"] = "true";
      const caps = detectTerminalCapabilities();
      expect(caps.isCI).toBe(true);
    });

    it("should detect CircleCI", () => {
      delete process.env["CI"];
      delete process.env["GITHUB_ACTIONS"];
      delete process.env["GITLAB_CI"];
      process.env["CIRCLECI"] = "true";
      const caps = detectTerminalCapabilities();
      expect(caps.isCI).toBe(true);
    });

    it("should detect Travis CI", () => {
      delete process.env["CI"];
      delete process.env["GITHUB_ACTIONS"];
      delete process.env["GITLAB_CI"];
      delete process.env["CIRCLECI"];
      process.env["TRAVIS"] = "true";
      const caps = detectTerminalCapabilities();
      expect(caps.isCI).toBe(true);
    });

    it("should detect Jenkins", () => {
      delete process.env["CI"];
      delete process.env["GITHUB_ACTIONS"];
      delete process.env["GITLAB_CI"];
      delete process.env["CIRCLECI"];
      delete process.env["TRAVIS"];
      process.env["JENKINS_URL"] = "http://jenkins.example.com";
      const caps = detectTerminalCapabilities();
      expect(caps.isCI).toBe(true);
    });
  });

  describe("dimensions", () => {
    it("should detect terminal columns", () => {
      Object.defineProperty(process.stdout, "columns", { value: 100, writable: true });
      const caps = detectTerminalCapabilities();
      expect(caps.columns).toBe(100);
    });

    it("should detect terminal rows", () => {
      Object.defineProperty(process.stdout, "rows", { value: 50, writable: true });
      const caps = detectTerminalCapabilities();
      expect(caps.rows).toBe(50);
    });

    it("should default to 80x24 when undefined", () => {
      Object.defineProperty(process.stdout, "columns", { value: undefined, writable: true });
      Object.defineProperty(process.stdout, "rows", { value: undefined, writable: true });
      const caps = detectTerminalCapabilities();
      expect(caps.columns).toBe(80);
      expect(caps.rows).toBe(24);
    });
  });
});

describe("supportsColor", () => {
  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return true when color depth meets minimum", () => {
    process.env["FORCE_COLOR"] = "3"; // truecolor
    expect(supportsColor("16")).toBe(true);
    expect(supportsColor("256")).toBe(true);
    expect(supportsColor("truecolor")).toBe(true);
  });

  it("should return false when color depth below minimum", () => {
    process.env["FORCE_COLOR"] = "1"; // 16 colors
    expect(supportsColor("256")).toBe(false);
    expect(supportsColor("truecolor")).toBe(false);
  });

  it("should return true for 16 when no color disabled", () => {
    delete process.env["FORCE_COLOR"];
    delete process.env["NO_COLOR"];
    process.env["TERM"] = "xterm";
    expect(supportsColor("16")).toBe(true);
  });
});

describe("isInteractive", () => {
  it("should return true when both stdin and stdout are TTY", () => {
    Object.defineProperty(process.stdout, "isTTY", { value: true, writable: true });
    Object.defineProperty(process.stdin, "isTTY", { value: true, writable: true });
    expect(isInteractive()).toBe(true);
  });

  it("should return false when stdout is not TTY", () => {
    Object.defineProperty(process.stdout, "isTTY", { value: false, writable: true });
    Object.defineProperty(process.stdin, "isTTY", { value: true, writable: true });
    expect(isInteractive()).toBe(false);
  });

  it("should return false when stdin is not TTY", () => {
    Object.defineProperty(process.stdout, "isTTY", { value: true, writable: true });
    Object.defineProperty(process.stdin, "isTTY", { value: false, writable: true });
    expect(isInteractive()).toBe(false);
  });
});
