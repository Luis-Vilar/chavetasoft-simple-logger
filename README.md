## Chavetasoft Simple Logger
This is a simple logger for Node.js. It has only one parameter and can enable or disable the file log writer. If you enable it, the file log will be saved in the root of the project with the name `log.json`.
Whether the file log writer is enabled or disabled, the console log will always be enabled.
Fast setup and easy to use, just two lines of code. 😊🚀


## Installation
```bash
npm install chavetasoft-simple-logger
```

## Usage JavaScript
```javascript
const express = require("express");
const chavetasoftLogger = require("chavetasoft-simple-logger");

const app = express();

app.use(chavetasoftLogger(true)); /*
true Enable the file log writer, 
false Disable the file log writer.
or you can use logger() without parameter
to disable the file log writer as default
*/


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

```
## Usage TypeScript
  ```typescript

import express, { Express, Request, Response } from "express";
import chavetasoftLogger from "chavetasoft-simple-logger";

const app: Express = express();
app.use(chavetasoftLogger(true));/*
true Enable the file log writer, 
false Disable the file log writer.
or you can use logger() without parameter
to disable the file log writer as default
*/

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

```

## Console Output
![Captura de pantalla 2024-02-27 a la(s) 22 21 48](https://github.com/Luis-Vilar/chavetasoft-simple-logger/assets/124309725/c57cbdaa-1831-4bf1-89ef-98b08b779e7a)


## File Log Output
```json
[
  {
    "method": "GET",
    "url": "/65758485",
    "date": "2024-02-26T01:57:21.094Z",
    "ip": "::ffff:127.0.0.1",
    "status": 404
  }
]
```

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Author
[Chavetasoft](https://luisvilar.netlify.app/)

## Version
0.2.0
