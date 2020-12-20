/*
  The shoppies project
  Copyright (c) 2020 brucehe<bruce.he.62@gmail.com>
  
  See LICENSE.txt for more information
*/

import { getImageDescriptor } from "./descriptor.js";

/**
 * download an image by the specified id, the req url is in format of .../images/:id
 * @param {*} req
 * @param {*} res
 */
export function downloadImage(req, res) {
  const id = req.params.id;
  const descriptor = getImageDescriptor(id);
  if (!descriptor) {
    res.status(404).send({ status: "fail", id, message: "Image not found" });
    return;
  }

  const { originalname, path } = descriptor;
  if (originalname.endsWith(".png")) {
    res.setHeader("Content-type", "image/png");
  } else if (originalname.endsWith(".jpg") || originalname.endsWith("./jpeg")) {
    res.setHeader("Content-Type", "image/jpeg");
  }
  res.download(path, originalname, (err) => {
    if (err) {
      res.status(500).send({
        status: "fail",
        id,
        message: "Could not download the file. " + err,
      });
    }
  });
}
