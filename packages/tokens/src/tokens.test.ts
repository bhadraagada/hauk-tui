import { describe, it, expect } from "vitest";
import {
  createDefaultTokens,
  mergeTokens,
  createTokens,
  lightTheme,
  highContrastTheme,
  asciiBorders,
} from "./tokens";

describe("createDefaultTokens", () => {
  it("should return a complete token set", () => {
    const tokens = createDefaultTokens();
    
    expect(tokens).toHaveProperty("colors");
    expect(tokens).toHaveProperty("space");
    expect(tokens).toHaveProperty("borders");
  });

  it("should include all color tokens", () => {
    const tokens = createDefaultTokens();
    
    expect(tokens.colors).toHaveProperty("fg");
    expect(tokens.colors).toHaveProperty("bg");
    expect(tokens.colors).toHaveProperty("muted");
    expect(tokens.colors).toHaveProperty("accent");
    expect(tokens.colors).toHaveProperty("success");
    expect(tokens.colors).toHaveProperty("warning");
    expect(tokens.colors).toHaveProperty("danger");
    expect(tokens.colors).toHaveProperty("border");
    expect(tokens.colors).toHaveProperty("focus");
    expect(tokens.colors).toHaveProperty("disabled");
  });

  it("should include all space tokens", () => {
    const tokens = createDefaultTokens();
    
    expect(tokens.space).toHaveProperty("none");
    expect(tokens.space).toHaveProperty("xs");
    expect(tokens.space).toHaveProperty("sm");
    expect(tokens.space).toHaveProperty("md");
    expect(tokens.space).toHaveProperty("lg");
    expect(tokens.space).toHaveProperty("xl");
    expect(tokens.space).toHaveProperty("2xl");
  });

  it("should include all border tokens", () => {
    const tokens = createDefaultTokens();
    
    expect(tokens.borders).toHaveProperty("none");
    expect(tokens.borders).toHaveProperty("single");
    expect(tokens.borders).toHaveProperty("double");
    expect(tokens.borders).toHaveProperty("rounded");
    expect(tokens.borders).toHaveProperty("bold");
    expect(tokens.borders).toHaveProperty("classic");
  });

  it("should return independent instances", () => {
    const tokens1 = createDefaultTokens();
    const tokens2 = createDefaultTokens();
    
    tokens1.colors.fg = "#000000";
    expect(tokens2.colors.fg).not.toBe("#000000");
  });

  it("should have correct default color values", () => {
    const tokens = createDefaultTokens();
    
    expect(tokens.colors.fg).toBe("#e4e4e7");
    expect(tokens.colors.bg).toBe("#18181b");
    expect(tokens.colors.accent).toBe("#3b82f6");
  });

  it("should have correct space values", () => {
    const tokens = createDefaultTokens();
    
    expect(tokens.space.none).toBe(0);
    expect(tokens.space.xs).toBe(1);
    expect(tokens.space.sm).toBe(2);
    expect(tokens.space.md).toBe(4);
    expect(tokens.space.lg).toBe(6);
    expect(tokens.space.xl).toBe(8);
    expect(tokens.space["2xl"]).toBe(12);
  });
});

describe("mergeTokens", () => {
  it("should merge color overrides", () => {
    const base = createDefaultTokens();
    const merged = mergeTokens(base, {
      colors: { fg: "#ffffff" },
    });
    
    expect(merged.colors.fg).toBe("#ffffff");
    expect(merged.colors.bg).toBe(base.colors.bg); // unchanged
  });

  it("should merge space overrides", () => {
    const base = createDefaultTokens();
    const merged = mergeTokens(base, {
      space: { md: 8 },
    });
    
    expect(merged.space.md).toBe(8);
    expect(merged.space.sm).toBe(base.space.sm); // unchanged
  });

  it("should merge border overrides", () => {
    const base = createDefaultTokens();
    const merged = mergeTokens(base, {
      borders: { single: "+-++-+|-" },
    });
    
    expect(merged.borders.single).toBe("+-++-+|-");
    expect(merged.borders.double).toBe(base.borders.double); // unchanged
  });

  it("should handle multiple category overrides", () => {
    const base = createDefaultTokens();
    const merged = mergeTokens(base, {
      colors: { accent: "#ff0000" },
      space: { lg: 10 },
      borders: { rounded: "+-++-+|-" },
    });
    
    expect(merged.colors.accent).toBe("#ff0000");
    expect(merged.space.lg).toBe(10);
    expect(merged.borders.rounded).toBe("+-++-+|-");
  });

  it("should not mutate original tokens", () => {
    const base = createDefaultTokens();
    const originalFg = base.colors.fg;
    
    mergeTokens(base, { colors: { fg: "#000000" } });
    
    expect(base.colors.fg).toBe(originalFg);
  });
});

describe("createTokens", () => {
  it("should return default tokens when no overrides provided", () => {
    const tokens = createTokens();
    const defaults = createDefaultTokens();
    
    expect(tokens.colors.fg).toBe(defaults.colors.fg);
    expect(tokens.space.md).toBe(defaults.space.md);
  });

  it("should apply overrides to default tokens", () => {
    const tokens = createTokens({
      colors: { fg: "#000000" },
    });
    
    expect(tokens.colors.fg).toBe("#000000");
    expect(tokens.colors.bg).toBe("#18181b"); // default
  });

  it("should handle undefined overrides", () => {
    const tokens = createTokens(undefined);
    const defaults = createDefaultTokens();
    
    expect(tokens.colors.fg).toBe(defaults.colors.fg);
  });
});

describe("theme presets", () => {
  describe("lightTheme", () => {
    it("should have light color values", () => {
      expect(lightTheme.colors?.fg).toBe("#18181b");
      expect(lightTheme.colors?.bg).toBe("#fafafa");
    });

    it("should be applicable to tokens", () => {
      const tokens = createTokens(lightTheme);
      
      expect(tokens.colors.fg).toBe("#18181b");
      expect(tokens.colors.bg).toBe("#fafafa");
    });
  });

  describe("highContrastTheme", () => {
    it("should have high contrast color values", () => {
      expect(highContrastTheme.colors?.fg).toBe("#ffffff");
      expect(highContrastTheme.colors?.bg).toBe("#000000");
    });

    it("should be applicable to tokens", () => {
      const tokens = createTokens(highContrastTheme);
      
      expect(tokens.colors.fg).toBe("#ffffff");
      expect(tokens.colors.bg).toBe("#000000");
      expect(tokens.colors.accent).toBe("#00d4ff");
    });
  });

  describe("asciiBorders", () => {
    it("should have ASCII-only border characters", () => {
      expect(asciiBorders.borders?.single).toBe("+-++-+|-");
      expect(asciiBorders.borders?.double).toBe("+-++-+|-");
      expect(asciiBorders.borders?.rounded).toBe("+-++-+|-");
    });

    it("should be applicable to tokens", () => {
      const tokens = createTokens(asciiBorders);
      
      expect(tokens.borders.single).toBe("+-++-+|-");
      expect(tokens.borders.rounded).toBe("+-++-+|-");
    });
  });
});

describe("token composition", () => {
  it("should allow combining multiple presets", () => {
    // First apply high contrast, then ASCII borders
    let tokens = createTokens(highContrastTheme);
    tokens = mergeTokens(tokens, asciiBorders);
    
    expect(tokens.colors.fg).toBe("#ffffff");
    expect(tokens.borders.single).toBe("+-++-+|-");
  });

  it("should allow custom tokens on top of presets", () => {
    const tokens = createTokens({
      ...lightTheme,
      colors: {
        ...lightTheme.colors,
        accent: "#ff6600",
      },
    });
    
    expect(tokens.colors.fg).toBe("#18181b"); // from light theme
    expect(tokens.colors.accent).toBe("#ff6600"); // custom
  });
});
