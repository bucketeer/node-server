"use strict";

require("rootpath")();

const goals = require("components/api/goals/goals.controller");
const express = require("express");
const utils = require("components/api/shared/utils");
const api = express.Router();

api.get("/", goals.getGoals);
api.post("/search", goals.searchGoals);

api.post("/", utils.isAuthenticated, goals.createGoal);
api.put("/:_id", utils.isAuthenticated, goals.updateGoalById);
api.delete("/:_id", utils.isAuthenticated, goals.deleteGoalById);

module.exports = api;