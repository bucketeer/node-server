"use strict";

require("rootpath")();

const goals = require("modules/goals/goals.controller");
const express = require("express");
const api = express.Router();

api.get("/", goals.getGoals);
api.post("/search", goals.searchGoals);
// api.use() AUTH goes here
api.post("/", goals.createGoal);
api.put("/:_id", goals.updateGoalById);
api.delete("/:_id", goals.deleteGoalById);

module.exports = api;