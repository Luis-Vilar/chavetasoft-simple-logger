// Loguer para Express

import { RequestHandler, Request, Response, NextFunction } from "express";
import fs from "fs/promises";

/**
 * Loguer para Express
 * @param enableOutput - Si se habilita, se guardará un archivo log.json con la información de las peticiones
 * @returns RequestHandler
 */
async function writeFile(date: Date, req: Request, res: Response) {
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
function logColor(color : number, partOfLog : string) {
  return(`\x1b[${color}m${partOfLog}\x1b[0m`);
}
function setColorStatus(status: number) {
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
function setColorVerb(verb: string) {
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
function prepareLog(date: Date, req: Request, res: Response) {
  const statusColor = setColorStatus(res.statusCode);
  const verbColor = setColorVerb(req.method);
  const dateColor = 35;
  const ipColor = 34;
  const urlColor = 0;

  const method = logColor(verbColor, `[${req.method}]`);
  const url = logColor(urlColor, req.originalUrl);
  const dateLog = logColor(dateColor, `${date}`);
  const ip = logColor(ipColor, `[IP] ${req.ip}`);
  const status = logColor(statusColor, `[STATUS] ${res.statusCode}`);
  const log =  `${method} ${url} ${status} ${ip} ${dateLog}\n\n`;
  
  return log;
}

function logger(enableOutput: Boolean): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const date = new Date();
    res.on("close", async () => {
      const log = prepareLog(date, req, res);
      console.log(log);
      enableOutput && (await writeFile(date, req, res));
      next();
    });
    next();
  };
}
export default logger;
module.exports = logger;
