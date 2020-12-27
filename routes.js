/*
  The shoppies project
  Copyright (c) 2020 brucehe<bruce.he.62@gmail.com>
  
  See LICENSE.txt for more information
*/

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

export default function setup(app) {
  app.get("/help", (req, res) =>
    res.send({
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
