import { appendFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

const bold = "\x1b[1m";

export default class Logger {
  private saveFile(info: string) {
    try {
      const data = new Date().toISOString().split("T")[0];
      const urlPath = `${process.cwd()}/logs/${data}.txt`;
      const dir = dirname(urlPath);

      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      if (existsSync(urlPath)) {
        appendFileSync(urlPath, info + "\n");
      } else {
        writeFileSync(urlPath, info + "\n");
      }
    } catch (error) {
      console.error("Erro ao gravar o log:", error);
    }
  }
  private static _instance: Logger;
  private formatText(text: string, ...formatCodes: string[]): string {
    const reset = "\x1b[0m";
    const formattedText = formatCodes.join("");
    return formattedText + text + reset;
  }
  private constructor() {}
  static get instance(): Logger {
    if (!Logger._instance) {
      Logger._instance = new Logger();
    }
    return Logger._instance;
  }
  debug(message: string): void {
    const body = `[${new Date().toISOString()}]` + `: ${message}`;
    console.log(this.formatText(body, colors.white));
  }
  warning(message: string): void {
    const body = `[${new Date().toISOString()}]` + `: ${message}`;
    console.log(this.formatText(body, colors.yellow));
    this.saveFile(body);
  }
  success(message: string): void {
    const body = `[${new Date().toISOString()}]` + `: ${message}`;
    console.log(this.formatText(body, colors.green));
  }
  error(message: string): void {
    const body = `[${new Date().toISOString()}]` + `: ${message}`;
    console.log(this.formatText(body, bold, colors.red));
    this.saveFile(body);
  }
}
