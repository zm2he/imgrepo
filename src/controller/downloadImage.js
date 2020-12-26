/*
  The shoppies project
  Copyright (c) 2020 brucehe<bruce.he.62@gmail.com>
  
  See LICENSE.txt for more information
*/

import { generateImageThumbnail, getImageDescriptor } from "./descriptor.js";

/**
 * download an image by the specified id, the req url is in format of .../images/:id
 * @param {*} req
 * @param {*} res
 */
export async function downloadImage(req, res) {
  const id = req.params.id;
  const descriptor = getImageDescriptor(id);
  if (!descriptor) {
    res
      .status(404)
      .send({
        status: "fail",
        originalUrl: req.originalUrl,
        message: "image not found",
      });
    return;
  }
  const type = req.query?.type || "original";
  if (type !== "original" && type !== "thumbnail") {
    res
      .status(400)
      .send({
        status: "fail",
        originalUrl: req.originalUrl,
        message: "bad request, type must be either original or thumbnail",
      });
    return;
  }

  const { originalname, path } = descriptor;
  if (originalname.endsWith(".png")) {
    res.setHeader("Content-type", "image/png");
  } else if (originalname.endsWith(".jpg") || originalname.endsWith("./jpeg")) {
    res.setHeader("Content-Type", "image/jpeg");
  }

  let filepath = path;
  if (type === "thumbnail") {
    filepath = await generateImageThumbnail(descriptor);
  }
  res.download(filepath, originalname, (err) => {
    if (err) {
      res.status(500).send({
        status: "fail",
        originalUrl: req.originalUrl,
        message: "Could not download the file. " + err,
      });
    }
  });
}
