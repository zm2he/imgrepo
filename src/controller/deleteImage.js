/*
  Image Repository project
  Copyright (c) 2020 brucehe<bruce.he.62@gmail.com>
  
  See LICENSE.txt for more information
*/

import fs from "fs";
import { deleteImageDescriptor, getImageDescriptor } from "./descriptor.js";
import { getUser } from './users.js';

/**
 * delete an image by the specified id, the req url is in format of .../images/:id
 * @param {*} req
 * @param {*} res
 */
export function deleteImage(req, res) {
  const id = req.params.id;
  const descriptor = getImageDescriptor(getUser(req), id);
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
  if(!descriptor.deletable) {
    res
      .status(401)
      .send({
        status: "fail",
        originalUrl: req.originalUrl,
        message: "you have no permission to delete the image",
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
