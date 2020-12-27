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
import imageThumbnail from "image-thumbnail";
import config from "../../config.js";
import { isImageDownloadable, isImageDeletable } from "./users.js";

/**
 * imageDescriptors maps an image id to an object { id, originalname, path, url }
 */
const imageDescriptors = new Map();

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
      if (!file.startsWith("img-")) {
        return;
      }
      // parse file name, and discard invalid file
      const index = file.indexOf("-", "img-".length);
      if (index === -1) {
        return;
      }
      const id = file.substr("img-".length, index);
      const originalname = file.substr(index + 1);
      if (!originalname) {
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
 * @param {*} user
 * @param {*} originalname
 */
export function addImageDescriptor(user, originalname) {
  if (user && originalname) {
    const id = `${user.id}${shortid.generate()}`;
    const descriptor = {
      id,
      originalname,
      path: `${config.getDataFolder()}/img-${id}-${originalname}`,
      url: `${config.baseUrl}/images/${id}`,
    };
    imageDescriptors.set(id, descriptor);
    return descriptor;
  }
}

/***
 * get an image's descriptor by id
 */
export function getImageDescriptor(user, id) {
  if (id && imageDescriptors.has(id)) {
    const descriptor = imageDescriptors.get(id);
    return {
      ...descriptor,
      downloadable: isImageDownloadable(user, id),
      deletable: isImageDeletable(user, id),
    };
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

    // delete the generated image thumbnail if exists
    const thumbnailPath = getImageThumbnialPath(descriptor);
    fs.unlink(thumbnailPath, (error) => {
      if (error) {
        console.log(error);
      }
    });
    return descriptor;
  }
}

/**
 * a thumbnail has the same file extension as the original image file
 * @param {} descriptor
 */
function getImageThumbnialPath(descriptor) {
  const { id, path } = descriptor;
  const index = path.lastIndexOf(".");
  if (index !== -1) {
    return `${config.getDataFolder()}/thumbnail-${id}${path.substr(index)}`;
  } else {
    return `${config.getDataFolder()}/thumbnail-${id}.jpg`;
  }
}

/**
 * generate an image's thumbnail, return the generated image thumbnial file path
 * @param {*} descriptor
 */
export async function generateImageThumbnail(descriptor) {
  try {
    const thumbnailPath = getImageThumbnialPath(descriptor);
    if (fs.existsSync(thumbnailPath)) {
      // return an already generated image thumbnail
      return thumbnailPath;
    }

    // generate image thumbnail on-the-fly
    const thumbnail = await imageThumbnail(descriptor.path);
    fs.appendFileSync(thumbnailPath, Buffer.from(thumbnail));
    return thumbnailPath;
  } catch (err) {
    console.error(err);
    // return an image placeholder if failed to generate a thumbnail
    return `${config.getImagePlaceholder()}`;
  }
}

scanImages(config.getDataFolder());
