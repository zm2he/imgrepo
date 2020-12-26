/*
  The shoppies project
  Copyright (c) 2020 brucehe<bruce.he.62@gmail.com>
  
  See LICENSE.txt for more information
*/

import config from "./config.js";
import { getImageList } from "./src/controller/getImageList.js";
import { downloadImage } from "./src/controller/downloadImage.js";
import { deleteImage } from "./src/controller/deleteImage.js";
import { uploadFormImages, uploadBinaryImage } from "./src/controller/uploadImages.js";
import { searchImages } from './src/controller/searchImages.js';

export default function setup(app) {
  app.get("/help", (req, res) =>
    res.send({
      getList: "GET /images",
      search: "GET /images/search?q=x",
      upload: "POST /images",
      get: "GET /images/:id[?type=original|thumbnail]",
      delete: "DELETE /images:id",
    })
  );
  app.get("/config", (req, res) => res.send(config));

  app.get("/images", getImageList);
  app.get("/images/:id", (req, res) =>{
    const id = req.params.id;
    if (id === "search") {
      searchImages(req, res);
    } else {
      downloadImage(req, res);
    }
  });
  app.delete("/images/:id", deleteImage);
  app.post("/images", uploadFormImages);
  app.post("/images/:name", uploadBinaryImage);
}
