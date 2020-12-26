/*
  The shoppies project
  Copyright (c) 2020 brucehe<bruce.he.62@gmail.com>
  
  See LICENSE.txt for more information
*/

import { getAllImageDescriptors } from "./descriptor.js";

/**
 * return images whose name matches the query term
 * @param {*} req
 * @param {*} res,
 */
export function searchImages(req, res) {
  let q = req.query.q;
  if (!q) {
    res.status(404).send({ status: "fail", id, message: "bad request" });
    return;
  }

  q = q.trim().toLowerCase();
  const descriptors = getAllImageDescriptors();
  const searchResults = descriptors
    .filter((descriptor) => {
      return descriptor.originalname.toLowerCase().includes(q);
    })
    .map((descriptor) => ({
      id: descriptor.id,
      name: descriptor.originalname,
      url: descriptor.url,
    }));
  res.status(200).send(searchResults);
}
