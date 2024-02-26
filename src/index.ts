// Loguer para Express

import { RequestHandler, Request, Response, NextFunction } from "express";
import fs from "fs/promises";

function logger(enableOutput: Boolean): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const date = new Date();
    res.on("close", async () => {
      const log = `[ ${req.method} ]${req.originalUrl} ${date} [ IP ]${req.ip} [ STATUS ]${res.statusCode}\n\n`;
      console.log(log);
      enableOutput && (await fs.appendFile("log.txt", log));
      next();
    });
    next();
  };
}
export default logger;
module.exports = logger;
