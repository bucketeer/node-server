"use strict";

require("rootpath")();

const Event = require("modules/events/events.model");
const Goal = require("modules/goals/goals.model");
const settings = require(`configs/environments/settings.${process.env.NODE_ENV || "development"}`);
const select = "_id name description category hashtags media location completed isPrivate";
const winston = require("winston");

module.exports.getGoals = (req, res) => {
    let redirect = req.body.redirect || false;
    let errorObj = {};
    let successObj = {};
    let pageSize = parseInt(req.query.pageSize || settings.api.results.defaultPageSize || 1);
    let page = parseInt(req.query.page || 0);
    let filter = {};
    
    if (req.query._id) {
        filter._id = req.query._id;
    }
    
    if (req.query._ids) {
        let idList = req.query._ids;
        filter._id = {
            $in: idList
        };
    }
    console.log(JSON.stringify(filter));
    Goal.paginate(filter, {
        select,
        offset: page * pageSize,
        limit: pageSize
    }, (err, goals) => {
        if (err) {
            winston.error(JSON.stringify(err));
            errorObj = {
                success: false,
                errCode: "0001",
                errMsg: "Failed to get goals.",
                redirect: redirect
            };
            return res.status(500).send(errorObj);
        }
        
        successObj = {
            success: true,
            msg: "Goals retrieved successfully.",
            goals: goals.docs,
            totalResults: goals.total,
            pageSize: pageSize,
            page: page,
            nextPage: `${settings.server.http.host}:${settings.server.http.port}/api/goals?page=${page+1}`,
            previousPage: (page - 1 < 0) ? false : `${settings.server.http.host}:${settings.server.http.port}/api/goals?page=${page-1}`,
            redirect: redirect
        };
        
        return res.status(200).send(successObj);
    });
};

module.exports.createGoal = (req, res) => {
    let redirect = req.body.redirect || false;
    let errorObj = {};
    let successObj = {};
    
    if (!req.body.goal) {
        errorObj = {
            success: false,
            errCode: "0002",
            errMsg: "No goal data supplied",
            redirect: redirect
        };
        return res.status(400).send(errorObj);
    }
    
    let goal = new Goal({
        name: req.body.goal.name,
        description: req.body.goal.description,
        category: req.body.goal.category,
        hashtags: req.body.goal.hashtags,
        location: req.body.goal.location,
        media: req.body.goal.media,
        completed: req.body.goal.completed,
        isPrivate: req.body.goal.isPrivate
    });
    
    if (req.body.goal._id) {
        goal._id = req.body.goal._id;
    }
   
    goal.save(function (err) {
        if (err && err.name === "ValidationError") {
            winston.error(JSON.stringify(err.errors));
            errorObj = {
                success: false,
                errCode: "0006",
                errMsg: "Validation error creating goal.",
                msg: JSON.stringify(err.errors),
                redirect: redirect
            };
            return res.status(400).send(errorObj);
        } else if (err) {
            winston.error(JSON.stringify(err));
            errorObj = {
                success: false,
                errCode: "0007",
                errMsg: "Error creating goal.",
                redirect: redirect
            };
            return res.status(500).send(errorObj);
        } else {
            successObj = {
                success: true,
                msg: "Goal created successfully.",
                goal: {
                    _id: goal._id,
                    name: goal.name,
                    description: goal.description,
                    category: goal.category,
                    hashtags: goal.hashtags,
                    location: goal.location,
                    media: goal.media,
                    completed: goal.completed,
                    isPrivate: goal.isPrivate
                },
                redirect: redirect
            };
            return res.status(201).send(successObj);
        }
    });
};

module.exports.updateGoalById = (req, res) => {
    let redirect = req.body.redirect || false;
    let errorObj = {};
    let successObj = {};
    
    Goal.findOne({
        _id: req.params._id
    }, (err, goal) => {
        if (!goal) {
            errorObj = {
                success: false,
                errCode: "0013",
                errMsg: "Goal does not exist.",
                redirect: redirect
            };

            return res.status(404).send(errorObj);
        }
        
        if (err) {
            winston.error(JSON.stringify(err));
            errorObj = {
                success: false,
                errCode: "0014",
                errMsg: "Failed to update goal.",
                msg: JSON.stringify(err),
                redirect: redirect
            };
            return res.status(500).send(errorObj);
        }
        
        let updategoal = {
            $set: {
                name: req.body.goal.name,
                description: req.body.goal.description,
                category: req.body.goal.category,
                hashtags: req.body.goal.hashtags,
                location: req.body.goal.location,
                media: req.body.goal.media,
                completed: req.body.goal.completed,
                isPrivate: req.body.goal.isPrivate
            }
        }
        
        Goal.update({
            _id: goal._id
        }, updategoal, {
            upsert: false
        }, (err) => {
            if (err) {
                winston.error(JSON.stringify(err));
                errorObj = {
                    success: false,
                    errCode: "0015",
                    errMsg: "Failed to update goal.",
                    msg: JSON.stringify(err),
                    redirect: redirect
                };
                return res.status(500).send(errorObj);
            }
            
            successObj = {
                success: true,
                msg: "Goal updated successfully.",
                goal: {
                    _id: goal._id,
                    name: req.body.goal.name,
                    description: req.body.goal.description,
                    category: req.body.goal.category,
                    hashtags: req.body.goal.hashtags,
                    location: req.body.goal.location,
                    media: req.body.goal.media,
                    completed: req.body.goal.completed,
                    isPrivate: req.body.goal.isPrivate
                },
                redirect: redirect
            };
            return res.status(200).send(successObj);
        });
    });
};

module.exports.deleteGoalById = (req, res) => {
    let redirect = req.body.redirect || false;
    let errorObj = {};
    let successObj = {};
   
    Goal.remove({
        _id: req.params._id
    }, function (err) {
        if (err) {
            winston.error(JSON.stringify(err));
            errorObj = {
                success: false,
                errCode: "0011",
                errMsg: "Error deleting goal.",
                msg: JSON.stringify(err),
                redirect: redirect
            };
            return res.status(500).send(errorObj);
        }
        
        successObj = {
            success: true,
            msg: "Goal deleted successfully.",
            redirect: redirect
        };
        return res.status(200).send(successObj);
    });
};