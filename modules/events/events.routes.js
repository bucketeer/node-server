"use strict";

require("rootpath")();

const events = require("modules/events/events.controller");
const express = require("express");
const api = express.Router();

api.get("/", events.getEvents);
api.post("/", events.createEvent);
api.delete("/:_id", events.deleteEventById);

module.exports = api;

