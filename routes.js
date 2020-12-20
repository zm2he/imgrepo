/*
  The shoppies project
  Copyright (c) 2020 brucehe<bruce.he.62@gmail.com>
  
  See LICENSE.txt for more information
*/

import fs from "fs";

import config from "./config.js";
import { getImageList } from "./src/controller/getImageList.js";
import { downloadImage } from "./src/controller/downloadImage.js";
import { deleteImage } from "./src/controller/deleteImage.js";
import { uploadImage } from "./src/controller/uploadImage.js";
import {
  addImageDescriptor,
  deleteImageDescriptor,
} from "./src/controller/descriptor.js";

export default function setup(app) {
  app.get("/help", (req, res) =>
    res.send({ getList: 'GET /images', upload: 'POST /images/upload', get: 'GET /images/:id', delete: 'DELETE /images:id'})
  );
  app.get("/config", (req, res) => res.send(config));

  app.get("/images", (req, res) => getImageList(req, res));
  app.get("/images/:id", (req, res) => downloadImage(req, res));
  app.delete("/images/:id", (req, res) => deleteImage(req, res));

  app.post(
    "/images/upload",
    uploadImage.single("upload"),
    (req, res) => {
      const { path, originalname } = req.file;
      const descriptor = addImageDescriptor(originalname);
      fs.rename(path, descriptor.path, function (err) {
        if (err) {
          deleteImageDescriptor(descriptor.id);
          console.log("ERROR: " + err);
          res
            .status(500)
            .send({ status: "fail", name: originalname, error: err.message });
          return;
        }
        res.send({
          status: "success",
          id: descriptor.id,
          name: descriptor.originalname,
          url: descriptor.url,
        });
      });
    },
    (error, req, res, next) => {
      res.status(400).send({
        status: "fail",
        name: req.file?.originalname,
        error: error.message,
      });
    }
  );
}
