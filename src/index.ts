// Loguer para Express

import { RequestHandler, Request, Response, NextFunction } from "express";
import fs from "fs/promises";
type enableOutputType = Boolean;
interface LoggerInterface  {
  enableOutput: Boolean;
  logger: () => RequestHandler;
};

class Logger implements LoggerInterface{
  enableOutput: Boolean;
  private async writeFile(date: Date, req: Request, res: Response) {
    const existentJson = await fs.readFile("log.json", "utf-8").catch(() => {
      return null;
    });
    if (!existentJson) {
      await fs.writeFile(
        "log.json",
        JSON.stringify(
          [
            {
              method: req.method,
              url: req.originalUrl,
              date: date,
              ip: req.ip,
              status: res.statusCode,
            },
          ],
          null,
          2
        )
      );
    } else {
      const logJson = JSON.parse(existentJson);
      logJson.push({
        method: req.method,
        url: req.originalUrl,
        date: date,
        ip: req.ip,
        status: res.statusCode,
      });
      await fs.writeFile("log.json", JSON.stringify(logJson, null, 2));
    }
  }
  private logColor(color: number, partOfLog: string) {
    return `\x1b[${color}m${partOfLog}\x1b[0m`;
  }
  private setColorStatus(status: number) {
    if (status >= 200 && status < 300) {
      return 32;
    } else if (status >= 300 && status < 400) {
      return 36;
    } else if (status >= 400 && status < 500) {
      return 33;
    } else {
      return 31;
    }
  }
  private setColorVerb(verb: string) {
    switch (verb) {
      case "GET":
        return 32;
      case "POST":
        return 36;
      case "PUT":
        return 33;
      case "DELETE":
        return 31;
      default:
        return 0;
    }
  }
  private prepareLog(date: Date, req: Request, res: Response) {
    const statusColor = this.setColorStatus(res.statusCode);
    const verbColor = this.setColorVerb(req.method);
    const dateColor = 35;
    const ipColor = 34;
    const urlColor = 0;

    const method = this.logColor(verbColor, `[${req.method}]`);
    const url = this.logColor(urlColor, req.originalUrl);
    const dateLog = this.logColor(dateColor, `${date}`);
    const ip = this.logColor(ipColor, `[IP] ${req.ip}`);
    const status = this.logColor(statusColor, `[STATUS] ${res.statusCode}`);
    const log = `${method} ${url} ${status} ${ip} ${dateLog}\n`;

    return log;
  }
  logger = (): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
      const date = new Date();
      res.on("close", async () => {
        const log = this.prepareLog(date, req, res);
        console.log(log);
        this.enableOutput && (await this.writeFile(date, req, res));
        next();
      });
      next();
    };
  };

  public constructor(enableOutput: enableOutputType) {
    this.enableOutput = enableOutput ? true : false;
  }
}

const logger = (enableOutput?: enableOutputType) => {
  const returnable = enableOutput
    ? new Logger(true).logger()
    : new Logger(false).logger();

  return returnable;
};

export default logger;
module.exports = logger;
