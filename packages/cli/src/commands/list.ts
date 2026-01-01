import { Command } from "commander";
import { getComponents, searchComponents } from "@hauktui/registry";
import { logger, highlight, dim } from "../utils/logger.js";

export const listCommand = new Command()
  .name("list")
  .alias("ls")
  .description("List available components")
  .option("-s, --search <query>", "Search components")
  .option("-c, --category <category>", "Filter by category")
  .action(async (options) => {
    let components = getComponents();

    // Apply search filter
    if (options.search) {
      components = searchComponents(options.search);
    }

    // Apply category filter
    if (options.category) {
      components = components.filter((c) => c.category === options.category);
    }

    if (components.length === 0) {
      logger.warn("No components found.");
      return;
    }

    logger.log("\nAvailable components:\n");

    // Group by category
    const byCategory = new Map<string, typeof components>();
    for (const comp of components) {
      const existing = byCategory.get(comp.category) ?? [];
      existing.push(comp);
      byCategory.set(comp.category, existing);
    }

    for (const [category, comps] of byCategory) {
      logger.log(`${highlight(category.toUpperCase())}`);
      for (const comp of comps) {
        logger.log(`  ${comp.name.padEnd(15)} ${dim(comp.description)}`);
      }
      logger.break();
    }

    logger.log(dim(`Run \`hauktui add <component>\` to add a component`));
  });
