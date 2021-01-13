/*
  The shoppies project
  Copyright (c) 2020 brucehe<bruce.he.62@gmail.com>
  
  See LICENSE.txt for more information
*/

import { generateImageThumbnail, getImageDescriptor } from "./descriptor.js";
import { getUser } from './users.js';

/**
 * download an image by the specified id, the req url is in format of .../images/:id
 * @param {*} req
 * @param {*} res
 */
export async function downloadImage(req, res) {
  const id = req.params.id;
  const descriptor = getImageDescriptor(getUser(req), id);
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
  if(!descriptor.downloadable) {
    res
      .status(401)
      .send({
        status: "fail",
        originalUrl: req.originalUrl,
        message: "you have no permission to download the image",
      });
    return;
  }
  
  const type = req.query?.type === 'thumbnail'? 'thumbnail':'original';
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
