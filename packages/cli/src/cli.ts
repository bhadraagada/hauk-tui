import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { addCommand } from "./commands/add.js";
import { listCommand } from "./commands/list.js";
import { viewCommand } from "./commands/view.js";
import { diffCommand } from "./commands/diff.js";
import { updateCommand } from "./commands/update.js";

const program = new Command();

program
  .name("hauktui")
  .description("A shadcn-like workflow for Terminal UIs")
  .version("0.0.3");

program.addCommand(initCommand);
program.addCommand(addCommand);
program.addCommand(listCommand);
program.addCommand(viewCommand);
program.addCommand(diffCommand);
program.addCommand(updateCommand);

export function run(): void {
  program.parse();
}
