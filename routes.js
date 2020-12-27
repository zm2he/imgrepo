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

export default function setup(app) {
  app.get("/help", (req, res) =>
    res.send({
      signup: "POST /signup",
      getList: "GET /images",
      search: "GET /images/search?q=x",
      upload: "POST /images",
      get: "GET /images/:id[?type=original|thumbnail]",
      delete: "DELETE /images:id",
    })
  );

  app.post("/signup", signup),
    app.get("/images", (req, res) => {
      if (validateReq(req, res)) {
        getImageList(req, res);
      }
    });

  app.get("/images/:id", (req, res) => {
    if (validateReq(req, res)) {
      const id = req.params.id;
      if (id === "search") {
        searchImages(req, res);
      } else {
        downloadImage(req, res);
      }
    }
  });

  app.delete("/images/:id", (req, res) => {
    if (validateReq(req, res)) {
      deleteImage(req, res);
    }
  });

  app.post("/images", (req, res) => {
    if (validateReq(req, res)) {
      uploadFormImages(req, res);
    }
  });

  app.post("/images/:name", (req, res) => {
    if (validateReq(req, res)) {
      uploadBinaryImage(req, res);
    }
  });
}
