"use strict";

require("rootpath")();

const users = require("modules/users/users.controller");
const express = require("express");
const api = express.Router();

api.get("/", users.getUsers);
api.post("/signup", users.signUpUser);
api.post("/signin", users.signInUser);
// api.use() AUTH goes here
api.put("/:_id", users.updateUserById);
api.delete("/:_id", users.deleteUserById);
api.post("/signout", users.signOutUser);

module.exports = api;