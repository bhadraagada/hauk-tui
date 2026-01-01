import { Command } from "commander";
import { getComponent } from "@hauktui/registry";
import { formatComponentInfo } from "../utils/registry.js";
import { logger } from "../utils/logger.js";

export const viewCommand = new Command()
  .name("view")
  .description("View component details")
  .argument("<component>", "Component name")
  .action(async (componentName: string) => {
    const meta = getComponent(componentName);

    if (!meta) {
      logger.error(`Component "${componentName}" not found.`);
      process.exit(1);
    }

    logger.break();
    logger.log(formatComponentInfo(meta));
    logger.break();
  });
