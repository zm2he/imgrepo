/*
  The shoppies project
  Copyright (c) 2020 brucehe<bruce.he.62@gmail.com>
  
  See LICENSE.txt for more information
*/

import fs from "fs";
import swaggerUI from "swagger-ui-express";
import config from './config.js';
import { signup, validateReq } from "./src/controller/users.js";
import { getImageList } from "./src/controller/getImageList.js";
import { downloadImage } from "./src/controller/downloadImage.js";
import { deleteImage } from "./src/controller/deleteImage.js";
import {
  uploadFormImages,
  uploadBinaryImage,
} from "./src/controller/uploadImages.js";
import { searchImages } from "./src/controller/searchImages.js";

/** */
function validateUserAndExecute(req, res, action) {
  try {
    if (validateReq(req, res)) {
      action(req, res);
    }
  } catch (error) {
    res.status(500).send({
      status: "fail",
      originalUrl: req.originalUrl,
      error: error.message,
    });
  }
}

const swagger = JSON.parse(fs.readFileSync(`${config.appFolder}/swagger.json`));
export function setupSwagger(app) {
  const baseUrl = config.baseUrl;
  const index = baseUrl.indexOf("://");
  if (index !== -1) {
    swagger.info.version = config.version;
    swagger.host = baseUrl.substr(index + 3);
    swagger.schemes = [baseUrl.substr(0, index)];
  }
  app.use(
    "/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(swagger, {
      explorer: false,
      swaggerOptions: {
        urls: [
          {
            url: baseUrl,
            name: "doc",
          },
        ],
      },
    })
  );
}

export function setupRoutes(app) {
  app.get("/", (req, res) => res.json(swagger));

  app.get("/help", (req, res) =>
    res.send({
      swagger: "GET /api-docs",
      signup: "POST /signup",
      getList: "GET /images",
      search: "GET /images/search?q=x",
      upload: "POST /images[?type=public|private]",
      get: "GET /images/:id[?type=original|thumbnail]",
      delete: "DELETE /images:id",
    })
  );

  app.post("/signup", signup);
  app.get("/images/:id", (req, res) =>
    validateUserAndExecute(req, res, (req, res) => {
      if (req.params.id === "search") {
        searchImages(req, res);
      } else {
        downloadImage(req, res);
      }
    })
  );
  app.get("/images", (req, res) =>
    validateUserAndExecute(req, res, getImageList)
  );
  app.delete("/images/:id", (req, res) =>
    validateUserAndExecute(req, res, deleteImage)
  );
  app.post("/images", (req, res) =>
    validateUserAndExecute(req, res, uploadFormImages)
  );
  app.post("/images/:name", (req, res) =>
    validateUserAndExecute(req, res, uploadBinaryImage)
  );
}
