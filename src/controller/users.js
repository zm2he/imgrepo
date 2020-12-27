/*
  The shoppies project
  Copyright (c) 2020 brucehe<bruce.he.62@gmail.com>
  
  See LICENSE.txt for more information
*/

/**
 * the users maps a user's mail to (email, pwdhash)
 * pls note we don't keep user's password in memory, we simply keep the password hash instead
 */

import fs from "fs";
import Crypto from "crypto-js";
import config from "../../config.js";

/**
 * users maps an email to user object { email, pwdHash }
 */
const users = new Map();

/**
 * calculate hash value, pls note the function uses MD5 but can change to any other stronger algorithem such as SHA256 instead
 */
function hash(message) {
  const bytes = Crypto.MD5(message);
  return bytes.toString(Crypto.enc.utf8);
}

/**
 * scan the specified folder to signed users
 * @param {*} directoryPath
 */
function scanUsers(directoryPath) {
  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      console.log(err);
      return;
    }

    files.forEach((file) => {
      // validate file name, must be: user-xxxx.json
      if (!file.startsWith("user-") || !file.endsWith(".json")) {
        return;
      }
      try {
        const content = fs.readFileSync(`${directoryPath}/${file}`, "utf8");
        const user = JSON.parse(content);
        users.set(user.email, user);
      } catch (error) {
        console.log(error);
      }
    });
  });
}

export function signup(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send({
      status: "fail",
      originalUrl: req.originalUrl,
      message: "bad request, body contains no email/or password",
    });
    return;
  }

  const lowerCasedEmail = email.toLowerCase();
  if (users.has(email)) {
    res.status(400).send({
      status: "fail",
      originalUrl: req.originalUrl,
      message: "user already signed up",
    });
    return;
  }

  const user = {
    email: lowerCasedEmail,
    pwdHash: hash(password),
  };
  const path = `${config.getDataFolder()}/user-${lowerCasedEmail}.json`;
  fs.writeFileSync(path, JSON.stringify(user));
  users.set(lowerCasedEmail, user);

  res.send({
    status: "success",
    originalUrl: req.originalUrl,
  });
}

/**
 * a validated request's header must contain email and password
 * @param {*} req
 * @param {*} res
 */
export function validateReq(req, res) {
  const user = getUser(req);
  if (user && users.has(user.email)) {
    if (users.get(user.email).pwdHash === hash(user.password)) {
      return true;
    }
  }
  res.status(401).send({
    status: "fail",
    originalUrl: req.originalUrl,
    message: "invalid user/or password",
  });
  return false;
}

export function getUser(req) {
  const { email, password } = req.headers;
  if (email && password) {
    const lowerCasedEmail = email.trim().toLowerCase();
    return {
      id: hash(email),
      email: lowerCasedEmail,
      password,
    };
  }
}

/**
 * check whether the user has permission to download the image
 * @param {*} user
 * @param {*} id
 */
export function isImageDownloadable(user, id) {
  return (
    id?.endsWith("$") || // is it a public image?
    id?.startsWith(user.id)
  ); // is it a user uploaded image?
}

/**
 * check whether the user has permission to delete the image
 */
export function isImageDeletable(user, id) {
  // only the user who uploaded the image can delete the image
  return id?.startsWith(user.id);
}

// load users from file to memory
scanUsers(config.getDataFolder());
