/*
  The shoppies project
  Copyright (c) 2020 brucehe<bruce.he.62@gmail.com>
  
  See LICENSE.txt for more information
*/

import { getAllImageDescriptors } from "./descriptor.js";
import { getUser, isImageDownloadable } from "./users.js";

/**
 * return images whose name matches the query term
 * @param {*} req
 * @param {*} res,
 */
export function searchImages(req, res) {
  let q = req.query.q;
  if (!q) {
    res.status(404).send({
      status: "fail",
      originalUrl: req.originalUrl,
      message: "bad request, parameter q not specified",
    });
    return;
  }

  q = q.trim().toLowerCase();
  const user = getUser(req);
  const descriptors = getAllImageDescriptors();
  const searchResults = descriptors
    .filter((descriptor) => {
      return (
        isImageDownloadable(user, descriptor.id) &&
        descriptor.originalname.toLowerCase().includes(q)
      );
    })
    .map((descriptor) => ({
      id: descriptor.id,
      name: descriptor.originalname,
      url: descriptor.url,
    }));

  res.status(200).send({
    status: "success",
    originalUrl: req.originalUrl,
    result: searchResults,
  });
}
