"use strict";

require("rootpath")();

const users = require("components/api/users/users.controller");
const express = require("express");
const utils = require("components/api/shared/utils");
const api = express.Router();


api.get("/", users.getUsers);
api.post("/signup", users.signUpUser);
api.post("/signin", users.signInUser);

api.put("/:_id", utils.isAuthenticated, users.updateUserById);
api.delete("/:_id", utils.isAuthenticated, users.deleteUserById);
api.post("/signout", utils.isAuthenticated, users.signOutUser);

module.exports = api;