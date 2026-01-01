import pc from "picocolors";

export const logger = {
  info: (message: string) => console.log(pc.blue("ℹ"), message),
  success: (message: string) => console.log(pc.green("✔"), message),
  warn: (message: string) => console.log(pc.yellow("⚠"), message),
  error: (message: string) => console.log(pc.red("✖"), message),
  log: (message: string) => console.log(message),
  break: () => console.log(),
};

export function highlight(text: string): string {
  return pc.cyan(text);
}

export function dim(text: string): string {
  return pc.dim(text);
}

export function bold(text: string): string {
  return pc.bold(text);
}
