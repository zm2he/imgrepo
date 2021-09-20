/*
  Image Repository project
  Copyright (c) 2020 brucehe<bruce.he.62@gmail.com>
  
  See LICENSE.txt for more information
*/

import fs from "fs";
import swaggerUI from "swagger-ui-express";
import config, { PUBLIC_INDICATOR } from "./config.js";
import { signup, login, validateReq } from "./src/controller/users.js";
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
      signup: "POST /api/signup",
      login: "POST /api/login",
      getList: "GET /api/images",
      search: "GET /api/images/search?q=x",
      upload: "POST /api/images[?type=public|private]",
      get: "GET /api/images/:id[?type=original|thumbnail]",
      delete: "DELETE /api/images:id",
    })
  );

  app.post("/api/signup", signup);
  app.post("/api/login", login);
  app.get("/api/images/:id", (req, res) => {
    const id = req.params.id;
    const isSearch = id === "search";
    if (!isSearch && id.endsWith(PUBLIC_INDICATOR)) {
      // no permission required to download a public image
      downloadImage(req, res);
    } else {
      validateUserAndExecute(req, res, (req, res) => {
        if (req.params.id === "search") {
          searchImages(req, res);
        } else {
          downloadImage(req, res);
        }
      });
    }
  });

  app.get("/api/images", (req, res) =>
    validateUserAndExecute(req, res, getImageList)
  );
  app.delete("/api/images/:id", (req, res) =>
    validateUserAndExecute(req, res, deleteImage)
  );
  app.post("/api/images", (req, res) =>
    validateUserAndExecute(req, res, uploadFormImages)
  );
  app.post("/api/images/:name", (req, res) =>
    validateUserAndExecute(req, res, uploadBinaryImage)
  );
}
