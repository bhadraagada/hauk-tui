#!/usr/bin/env node
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();

const templatesRoot = path.join(__dirname, '..', 'templates');

const available = {
  button: path.join(templatesRoot, 'components', 'Button.tsx'),
  select: path.join(templatesRoot, 'components', 'Select.tsx'),
  'focus-ring': path.join(templatesRoot, 'primitives', 'FocusRing.tsx'),
  'keymap-provider': path.join(templatesRoot, 'primitives', 'KeymapProvider.tsx'),
  tokens: path.join(templatesRoot, 'tokens', 'index.ts')
} as const;

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(src: string, dest: string) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

program
  .name('hauktui')
  .description('haukTUI scaffolder - copy TUI components into your project')
  .version('0.0.1');

program
  .command('list')
  .description('List available components/templates')
  .action(() => {
    console.log(Object.keys(available).join('\n'));
  });

program
  .command('add')
  .description('Add one or more templates to your project: e.g., "hauktui add button select"')
  .argument('<names...>', 'Template names')
  .option('-d, --dir <path>', 'Destination base dir', 'src/tui')
  .action((names: string[], options: { dir: string }) => {
    const destBase = path.resolve(process.cwd(), options.dir);
    ensureDir(destBase);

    const needed = new Set<string>();
    for (const name of names) {
      if (!(name in available)) {
        console.error(`Unknown template: ${name}`);
        process.exitCode = 1;
        return;
      }
      needed.add(name);
      // Implicit deps: components depend on tokens and primitives
      if (name === 'button' || name === 'select') {
        needed.add('tokens');
        needed.add('focus-ring');
      }
    }

    for (const name of needed) {
      const src = (available as any)[name] as string;
      let dest: string;
      if (name === 'tokens') dest = path.join(destBase, 'tokens', 'index.ts');
      else if (name === 'focus-ring' || name === 'keymap-provider') dest = path.join(destBase, 'primitives', path.basename(src));
      else dest = path.join(destBase, 'components', path.basename(src));

      copyFile(src, dest);
      console.log(`✔ Copied ${name} → ${path.relative(process.cwd(), dest)}`);
    }
  });

program.parse(process.argv);

