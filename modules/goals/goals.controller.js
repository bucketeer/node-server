"use strict";

require("rootpath")();

const Event = require("modules/events/events.model");
const Goal = require("modules/goals/goals.model");
const settings = require(`configs/environments/settings.${process.env.NODE_ENV || "development"}`); 
const select = "_id name category hashtags img location completed isPrivate";

module.exports.getGoals = (req, res) => {
    let redirect = req.body.redirect || false;
    let errorObj = {};
    let successObj = {};
    let pageSize = parseInt(req.query.pageSize || settings.api.results.defaultPageSize || 1);
    let page = parseInt(req.query.page || 0);  
    let filter = {};
    if(req.query.id) {
        filter._id = req.query._id;        
    }    
    if(req.query.ids) {
        let idList = req.query._ids;
        filter._id = { $in : idList };
    }
    Goal.paginate(filter, {
            select, offset: page*pageSize, limit: pageSize
        }, (err, goals) => {
        if (err) {
            winston.error(JSON.stringify(err));
            errorObj = {
                success: false,
                errCode: "0001",
                msg: "Failed to get goals.",
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
            previousPage: (page-1 < 0) ? false : `${settings.server.http.host}:${settings.server.http.port}/api/goals?page=${page-1}`,
            redirect: redirect
        };
        return res.status(200).send(successObj);
    });
};

module.exports.createGoal = (req, res) => {
    let redirect = req.body.redirect || false;
    let errorObj = {};
    let successObj = {};
    if(!req.body.goal) {
        errorObj = {
            success: false,
            errCode: "0002",
            msg: "No goal data supplied",
            redirect: redirect
        };
        return res.status(400).send(errorObj);
    }
    let goal = new Goal({
        name: req.body.goal.name,
        category:req.body.goal.category,
        hashtags: req.body.goal.hashtags,
        location: req.body.goal.location,
        img: req.body.goal.img,
        completed: req.body.goal.completed,
        isPrivate: req.body.goal.isPrivate
    });
    if(req.body.goal._id){
        goal._id = req.body.goal._id;
    }
    goal.save(function(err) {        
        if (err && err.name === "ValidationError") {
            winston.error(JSON.stringify(err.errors));                      
            errorObj = {
                success:false,
                errCode: "0006",
                errMsg: JSON.stringify(err.errors),
                msg: "Validation error creating goal.",
                redirect: redirect
            };
            return res.status(400).send(errorObj);
        } else if (err) {
            winston.error(JSON.stringify(err));      
            errorObj = {
                success: false,
                errCode: "0007",
                msg: "Error creating goal.",
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
                    category: goal.category,
                    hashtags:  goal.hashtags,
                    location:  goal.location,
                    img: goal.img,
                    completed: goal.completed, 
                    isPrivate:  goal.isPrivate                
                },
                redirect: redirect
            };
            res.status(201).send(successObj);
        }
    });
};

module.exports.updateGoalById = (req,res) => {
  let redirect = req.body.redirect || false;  
  let errorObj = {};
  let successObj = {};
  Goal.findOne({ _id: req.params._id }, (err, goal) => {            
    if (!goal) {       
        errorObj = {
            success: false,
            errCode: "0013",
            msg: "Goal does not exist.",
            redirect: redirect
        };

       return res.status(404).send(errorObj);
    }  
    if (err) {
       winston.error(JSON.stringify(err));
       errorObj = {
            success: false,
            errCode: "0014",
            errMsg: JSON.stringify(err),
            msg: "Failed to update goal.",
            redirect: redirect
        };
       return res.status(500).send(errorObj);
    }  
    let updategoal = { 
        $set: {
            name: req.body.goal.name,
            category:req.body.goal.category,
            hashtags: req.body.goal.hashtags,
            location: req.body.goal.location,
            img: req.body.goal.img,
            completed: req.body.goal.completed, 
            isPrivate: req.body.goal.isPrivate
        }
    }  
    Goal.update({_id : goal._id},updategoal,{upsert: false}, (err) => {
      if (err) {
        winston.error(JSON.stringify(err));
        errorObj = {
            success: false,
            errCode: "0015",
            errMsg: JSON.stringify(err),
            msg: "Failed to update goal.",
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
            category: req.body.goal.category,
            hashtags:  req.body.goal.hashtags,
            location:  req.body.goal.location,
            img: req.body.goal.img,
            completed: req.body.goal.completed,
            isPrivate:  req.body.goal.isPrivate  
        },
        redirect: redirect
      };
      res.status(200).send(successObj);
    });
  });
};

module.exports.deleteGoalById = (req, res) => {
    let redirect = req.body.redirect || false;
    let errorObj = {};
    let successObj = {};
    Goal.remove({ _id: req.params._id }, function (err) {
        if (err) {
            winston.error(JSON.stringify(err));
            errorObj = {
                success: false,
                errCode: "0011",
                errMsg: JSON.stringify(err),
                msg: "Error deleting goal.",
                redirect: redirect
            };
            return res.status(500).send(errorObj);
        }
        successObj = {
            success: true,
            msg: "Goal deleted successfully.",
            redirect: redirect
        };
        res.status(200).send(successObj); 
    });
};

