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

function logger(enableOutput: Boolean): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const date = new Date();
    res.on("close", async () => {
      const log = `[ ${req.method} ]${req.originalUrl} ${date} [ IP ]${req.ip} [ STATUS ]${res.statusCode}\n\n`;
      console.log(log);
      enableOutput && (await writeFile(date, req, res));
      next();
    });
    next();
  };
}
export default logger;
module.exports = logger;
