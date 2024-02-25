// Loguer para Express

import { RequestHandler, Request, Response, NextFunction } from "express";
import fs from "fs/promises";

function logger(enableOutput: Boolean = true): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    const date = new Date();
    const log = `[ ${req.method} ]${req.originalUrl} ${date} [ IP ]${req.ip}\n\n`;
    console.log(log);
    enableOutput && (await fs.appendFile("log.txt", log));
    next();
  };
}
export default logger;
module.exports = logger;
