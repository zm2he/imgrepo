/*
  The shoppies project
  Copyright (c) 2020 brucehe<bruce.he.62@gmail.com>
  
  See LICENSE.txt for more information
*/

import fs from "fs";
import { deleteImageDescriptor, getImageDescriptor } from "./descriptor.js";

/**
 * delete an image by the specified id, the req url is in format of .../images/:id
 * @param {*} req
 * @param {*} res
 */
export function deleteImage(req, res) {
  const id = req.params.id;
  const descriptor = getImageDescriptor(id);
  if (!descriptor) {
    res
      .status(404)
      .send({
        status: "fail",
        originalUrl: req.originalUrl,
        message: "Image not found",
      });
    return;
  }

  fs.unlink(descriptor.path, (error) => {
    if (error) {
      console.error(error);
      res.status(500).send({
        status: "fail",
        originalUrl: req.originalUrl,
        message: "Could not delete the image. " + error,
      });
      return;
    }

    //file removed
    deleteImageDescriptor(id);

    res.send({
      status: "success",
      originalUrl: req.originalUrl,
      name: descriptor.originalname,
      message: "image deleted",
    });
  });
}
