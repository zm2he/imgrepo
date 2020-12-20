/*
  The shoppies project
  Copyright (c) 2020 brucehe<bruce.he.62@gmail.com>
  
  See LICENSE.txt for more information
*/

import cors from "cors";
import express from "express";
import setupRoutes from "./routes.js";
import config from "./config.js";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`received ${req.method} ${req.originalUrl}`);
  next();
});
setupRoutes(app);


// start to listening
const port = config.port;
app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
