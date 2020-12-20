/*
  The shoppies project
  Copyright (c) 2020 brucehe<bruce.he.62@gmail.com>
  
  See LICENSE.txt for more information
*/

/**
 * an image descriptor maps an id to the image's storage info, which includes
 *    originalnam - the image's original name
 *    path - local path of the image
 *    url - url to obtain the image
 */

import shortid from "shortid";
import fs from "fs";
import config from "../../config.js";

const imageDescriptors = new Map(); // map(id, { id, originalname, path, url })

/**
 * scan the specified folder to load images' descriptors into memory cache
 * @param {*} directoryPath
 */
function scanImages(directoryPath) {
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return;
    }
    files.forEach((file) => {
      // parse file name, and discard invalid file
      const index = file.indexOf("-");
      if (index === -1) {
        return;
      }
      const id = file.substr(0, index);
      const originalname = file.substr(index + 1);
      if (!shortid.isValid(id) || !originalname) {
        return;
      }

      imageDescriptors.set(id, {
        id,
        originalname,
        path: `${directoryPath}/${file}`,
        url: `${config.baseUrl}/images/${id}`,
      });
    });
  });
}

/**
 * return all image's descriptors (those kept in memory)
 */
export function getAllImageDescriptors() {
  const descriptors = [];
  imageDescriptors.forEach((descriptor) => descriptors.push(descriptor));
  return descriptors;
}

/**
 * add a new image descriptor, the image's id is auto-generated
 * @param {*} originalname
 */
export function addImageDescriptor(originalname) {
  if (originalname) {
    const id = shortid.generate();
    const descriptor = {
      id,
      originalname,
      path: `${config.getImageFileFolder()}/${id}-${originalname}`,
      url: `${config.baseUrl}/images/${id}`,
    };
    imageDescriptors.set(id, descriptor);
    return descriptor;
  }
}

/***
 * get an image's descriptor by id
 */
export function getImageDescriptor(id) {
  if (id && imageDescriptors.has(id)) {
    return imageDescriptors.get(id);
  }
}

/**
 * delete an image's descriptor by id
 * @param {} id
 */
export function deleteImageDescriptor(id) {
  if (id && imageDescriptors.has(id)) {
    const descriptor = imageDescriptors.get(id);
    imageDescriptors.delete(id);
    return descriptor;
  }
}

scanImages(config.getImageFileFolder());
