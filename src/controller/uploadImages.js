/*
  Image Repository project
  Copyright (c) 2020 brucehe<bruce.he.62@gmail.com>
  
  See LICENSE.txt for more information
*/

import fs from "fs";
import { addImageDescriptor, deleteImageDescriptor } from "./descriptor.js";
import { getUser } from "./users.js";

function isImageFile(name) {
  return name?.match(/\.(png|jpg|jpeg)$/);
}

/**
 * upload one image using binary type body
 * @param {*} req
 * @param {*} res
 */
export function uploadBinaryImage(req, res) {
  try {
    const name = req.params.name;
    if (!isImageFile(name)) {
      res.send({
        status: "fail",
        originalUrl: req.originalUrl,
        message: "image file must end with jpg|jpeg|png",
      });
      return;
    }

    let data = new Buffer("");
    req.on("data", (chunk) => {
      data = Buffer.concat([data, chunk]);
    });
    req.on("end", () => {
      const descriptor = addImageDescriptor(getUser(req), name, req.query.type);
      fs.writeFile(descriptor.path, data, "binary", (error) => {
        if (error) {
          res.status(500).send({
            status: "fail",
            originalUrl: req.originalUrl,
            error: error?.message,
          });
          deleteImageDescriptor(descriptor);
        } else {
          res.send({
            status: "success",
            message: "image uploaded",
            originalUrl: req.originalUrl,
            id: descriptor.id,
            name: descriptor.originalname,
            url: descriptor.url,
          });
        }
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "fail",
      originalUrl: req.originalUrl,
      error: error.message,
    });
  }
}

/**
 * upload one or multiple images using form-data type body
 * @param {*} req
 * @param {*} res
 */
export function uploadFormImages(req, res) {
  if (!req.files) {
    res.send({
      status: "fail",
      originalUrl: req.originalUrl,
      message: "no image uploaded",
    });
    return;
  }

  const descriptors = [];
  let images = req.files.images || req.files.image;
  if (!Array.isArray(images)) {
    images = [images];
  }
  images.forEach((img) => {
    const { name, mimetype, size } = img;
    if (!mimetype.startsWith("image/")) {
      console.log(`discarded a non-image file: ${name}`);
      return;
    }
    if (!size) {
      console.log(`discarded a zero-length image file: ${name}`);
      return;
    }

    const descriptor = addImageDescriptor(getUser(req), name, req.query.type);
    //Use the mv() method to place the image in dest directory (i.e. "/data" folder)
    img.mv(descriptor.path);
    descriptors.push(descriptor);
  });

  //send response
  if (descriptors.length === 0) {
    res.send({
      status: "fail",
      originalUrl: req.originalUrl,
      message: "no image uploaded",
    });
  } else if (descriptors.length === 1) {
    const descriptor = descriptors[0];
    res.send({
      status: "success",
      originalUrl: req.originalUrl,
      message: "image uploaded",
      id: descriptor.id,
      name: descriptor.originalname,
      url: descriptor.url,
    });
  } else {
    res.send({
      status: "success",
      originalUrl: req.originalUrl,
      message: "images uploaded",
      images: descriptors.map((descriptor) => ({
        id: descriptor.id,
        name: descriptor.originalname,
        url: descriptor.url,
      })),
    });
  }
}
