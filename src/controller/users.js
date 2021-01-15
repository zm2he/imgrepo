/*
  Image Repository project
  Copyright (c) 2020 brucehe<bruce.he.62@gmail.com>
  
  See LICENSE.txt for more information
*/

import fs from "fs";
import Crypto from "crypto-js";
import config, { ID_SEPARATOR, PUBLIC_INDICATOR } from "../../config.js";

/**
 * "users" maps a user's id, to an object { email, hashpwd }
 * pls note we don't keep user's password in memory, we simply keep the password hash instead
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
      // validate file name, must be: user$id.json
      const prefix = `user${ID_SEPARATOR}`;
      const suffix = ".json";
      if (!file.startsWith(prefix) || !file.endsWith(suffix)) {
        return;
      }
      try {
        const id = file.substr(
          prefix.length,
          file.length - prefix.length - suffix.length
        );
        const content = fs.readFileSync(`${directoryPath}/${file}`);
        const userInfo = JSON.parse(content);
        if (id === userInfo.id) {
          users.set(id, userInfo);
          console.log(`found user ${id}`)
        } else {
          console.log(`discarded a mismatched user record ${id}`);
        }
      } catch (error) {
        console.log(error);
      }
    });
  });
}

function getUserId(email) {
  return hash(email.toLowerCase());
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

  const id = getUserId(email);
  if (users.has(id)) {
    const _user = users.get(id);
    if (hash(password) === _user.pwdhash) {
      res.send({
        status: "success",
        id,
        originalUrl: req.originalUrl,
        message: "user already signed up",
      });
    } else {
      res.status(400).send({
        status: "fail",
        id,
        originalUrl: req.originalUrl,
        message: "user signed up with a different password",
      });
    }
    return;
  }

  try {
    const userInfo = {
      id,
      email,
      pwdhash: hash(password),
      created: Date.now(),
    };
    const path = `${config.getDataFolder()}/user${ID_SEPARATOR}${id}.json`;
    fs.writeFileSync(path, JSON.stringify(userInfo));
    users.set(id, userInfo);

    res.send({
      status: "success",
      id,
      originalUrl: req.originalUrl,
    });
  } catch (error) {
    res.status(500).send({
      status: "fail",
      originalUrl: req.originalUrl,
      error: error.message,
    });
  }
}

export function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send({
      status: "fail",
      originalUrl: req.originalUrl,
      message: "bad request, body contains no email/or password",
    });
    return;
  }

  const id = getUserId(email);
  if (!users.has(id)) {
    res.status(404).send({
      status: "fail",
      id,
      originalUrl: req.originalUrl,
      message: "user not found",
    });
    return;
  }

  const _user = users.get(id);
  if (hash(password) === _user.pwdhash) {
    res.send({
      status: "success",
      id,
      originalUrl: req.originalUrl,
      message: "user already signed up",
    });
  } else {
    res.status(400).send({
      status: "fail",
      id,
      originalUrl: req.originalUrl,
      message: "user signed up with a different password",
    });
  }
}

/**
 * a validated request's header must contain email and password
 * @param {*} req
 * @param {*} res
 */
export function validateReq(req, res) {
  const user = getUser(req);
  if (user && users.has(user.id)) {
    const _user = users.get(user.id);
    if (_user.pwdhash === hash(user.password)) {
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
    return {
      id: getUserId(email),
      email,
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
    id?.endsWith(PUBLIC_INDICATOR) || // is it a public image?
    id?.startsWith(user?.id)
  ); // is it a user uploaded image?
}

/**
 * check whether the user has permission to delete the image
 */
export function isImageDeletable(user, id) {
  // only the user who uploaded the image can delete the image
  return id?.startsWith(user?.id);
}

// load users from file to memory
scanUsers(config.getDataFolder());
