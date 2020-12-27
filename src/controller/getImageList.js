/*
  The shoppies project
  Copyright (c) 2020 brucehe<bruce.he.62@gmail.com>
  
  See LICENSE.txt for more information
*/

import { getAllImageDescriptors } from "./descriptor.js";
import { getUser, isImageDownloadable } from "./users.js";

/**
 * return all images, this function does not require any params
 * @param {*} req
 * @param {*} res,
 */
export function getImageList(req, res) {
  const user = getUser(req);
  const descriptors = getAllImageDescriptors();
  const imageList = descriptors
    .map((descriptor) => ({
      id: descriptor.id,
      name: descriptor.originalname,
      url: descriptor.url,
    }))
    .filter((descriptor) => isImageDownloadable(user, descriptor.id));
  res.status(200).send({
    status: "success",
    originalUrl: req.originalUrl,
    result: imageList,
  });
}
