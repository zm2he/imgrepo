/*
  The shoppies project
  Copyright (c) 2020 brucehe<bruce.he.62@gmail.com>
  
  See LICENSE.txt for more information
*/

/**
 * the following two configurations can be read from environment varaibles
 *     IMGREPO_PORT - port number to be listening on, default is 8080
 *     IMGREPO_MAX_IMG_SIZE - maximum allowed image size in bytes, maximum is 10m
 */

const port = process.env.IMGREPO_PORT || 8080;
const config = {
  version: "1.0.201219",

  port,
  baseUrl: `http://localhost:${port}`,

  appFolder: ".",

  // maximum allowed image size, 10m by default
  maxImageSize: process.env.IMGREPO_MAX_IMG_SIZE || 10 * 1024 * 1024,

  getUserFileFolder() {
    return this.appFolder + "/users";
  },
  
  // images are saved to local sub-folder /images
  getImageFileFolder() {
    return this.appFolder + "/images";
  },

  getImagePlaceholder() {
    return this.appFolder + '/public/image-placeholder.png'
  }
};

config.appFolder = process.cwd();

export default config;
