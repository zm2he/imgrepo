/*
  The shoppies project
  Copyright (c) 2020 brucehe<bruce.he.62@gmail.com>
  
  See LICENSE.txt for more information
*/

import { addImageDescriptor } from "./descriptor.js";

/**
 * upload one or multiple images
 * @param {*} req
 * @param {*} res
 */
export function uploadImages(req, res) {
  try {
    if (!req.files) {
      res.send({
        status: "fail",
        message: "No image uploaded",
      });
    } else {
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

        const descriptor = addImageDescriptor(name);
        //Use the mv() method to place the image in dest directory (i.e. "/images" folder)
        img.mv(descriptor.path);
        descriptors.push(descriptor);
      });

      //send response
      if (descriptors.length === 0) {
        res.send({
          status: "fail",
          message: "No image uploaded",
        });
      } else if (descriptors.length === 1) {
        const descriptor = descriptors[0];
        res.send({
          status: "success",
          message: "image uploaded",
          id: descriptor.id,
          name: descriptor.originalname,
          url: descriptor.url,
        });
      } else {
        res.send({
          status: "success",
          message: "images uploaded",
          images: descriptors.map((descriptor) => ({
            id: descriptor.id,
            name: descriptor.originalname,
            url: descriptor.url,
          })),
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      status: "fail",
      error: error.message,
    });
  }
}
