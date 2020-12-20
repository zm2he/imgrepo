/*
  The shoppies project
  Copyright (c) 2020 brucehe<bruce.he.62@gmail.com>
  
  See LICENSE.txt for more information
*/

import multer from "multer";
import config from "./../../config.js";

/**
 * upload an image by using multer module, pls refer to https://www.npmjs.com/package/multer for more information
 * pls note we only accept file name with extension png/jpg/jpeg
 *
 */
export const uploadImage = multer({
  limits: {
    fileSize: config.maxImageSize,
  },

  dest: config.getImageFileFolder(),

  fileFilter(req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      cb(new Error("Please upload an image."));
    }
    cb(null, true);
  },
});
