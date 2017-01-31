"use strict";

require("rootpath")();

const Event = require("components/api/events/events.model");
const jwt = require("jsonwebtoken");
const User = require("components/api/users/users.model");
const settings = require(`configs/environments/settings.${process.env.NODE_ENV || "development"}`);
const select = "_id email goals publicGoals roles profile";
const winston = require("winston");

module.exports.getUsers = (req, res) => {
    let redirect = req.body.redirect || false;
    let errorObj = {};
    let successObj = {};
    let pageSize = parseInt(req.query.pageSize || settings.api.results.defaultPageSize || 1);
    let page = parseInt(req.query.page || 0);
    let filter = {};

    if (req.query._id) {
        filter._id = req.query._id;
    }

    User.paginate(filter, {
        select,
        offset: page * pageSize,
        limit: pageSize
    }, (err, users) => {
        if (err) {
            winston.error(JSON.stringify(err));
            errorObj = {
                success: false,
                errCode: "0001",
                errMsg: "Failed to get users.",
                msg: JSON.stringify(err),
                redirect: redirect
            };
            return res.status(500).send(errorObj);
        }

        successObj = {
            success: true,
            msg: "Users retrieved successfully.",
            users: users.docs,
            totalResults: users.total,
            pageSize: pageSize,
            page: page,
            nextPage: `${settings.server.http.host}:${settings.server.http.port}/api/users?page=${page+1}`,
            previousPage: (page - 1 < 0) ? false : `${settings.server.http.host}:${settings.server.http.port}/api/users?page=${page-1}`,
            redirect: redirect
        };

        return res.status(200).send(successObj);
    });
};

module.exports.signUpUser = (req, res) => {
    let redirect = req.body.redirect || false;
    let errorObj = {};
    let successObj = {};

    if (!req.body.user) {
        errorObj = {
            success: false,
            errCode: "0002",
            errMsg: "No user data supplied",
            redirect: redirect
        };
        return res.status(200).send(errorObj);
    }

    let user = new User({
        email: req.body.user.email,
        password: req.body.user.password,
        goals: req.body.user.goals,
        publicGoals: req.body.user.publicGoals
    });

    if (req.body.user.profile) {
        user.profile = {
            username: req.body.user.profile.username,
            name: req.body.user.profile.name,
            gender: req.body.user.profile.gender,
            location: req.body.user.profile.location
        };

        if (req.body.user.profile.media) {
            user.profile.media = {
                url: req.body.user.profile.media.url,
                img: req.body.user.profile.media.img
            };
        }
    }

    if (req.body.user._id) {
        user._id = req.body.user._id;
    }

    User.findOne({
        email: req.body.user.email
    }, (err, existingUser) => {
        if (err) {
            winston.error(JSON.stringify(err));
            errorObj = {
                success: false,
                errCode: "0003",
                errMsg: "Error creating user.",
                msg: JSON.stringify(err),
                redirect: redirect
            };
            return res.status(500).send(errorObj);
        }

        if (existingUser) {
            errorObj = {
                success: false,
                errCode: "0004",
                errMsg: "User with that email address already exists.",
                redirect: redirect
            };
            return res.status(200).send(errorObj);
        }

        user.save(function (err) {
            if (err && err.code === 11000) {
                winston.error(JSON.stringify(err));
                errorObj = {
                    success: false,
                    errCode: "0005",
                    errMsg: "User with that email address already exists.",
                    msg: JSON.stringify(err),
                    redirect: redirect
                };
                return res.status(200).send(errorObj);
            } else if (err && err.name === "ValidationError") {
                errorObj = {
                    success: false,
                    isValidationError: true,
                    errCode: "0006",
                    errMsg: "Validation error creating user.",
                    msg: JSON.stringify(err.errors),
                    redirect: redirect
                };
                return res.status(200).send(errorObj);
            } else if (err) {
                winston.error(JSON.stringify(err));
                errorObj = {
                    success: false,
                    errCode: "0007",
                    errMsg: "Error creating user.",
                    msg: JSON.stringify(err),
                    redirect: redirect
                };
                return res.status(500).send(errorObj);
            } else {
                let token = jwt.sign({
                    _id: user._id
                }, settings.api.token.secret, settings.api.token.options);
                res.cookie("token", token);
                successObj = {
                    success: true,
                    msg: "User created successfully.",
                    authenticated: true,
                    user: {
                        _id: user._id,
                        goals: req.body.user.goals,
                        publicGoals: req.body.user.publicGoals,
                        roles: user.roles,
                        profile: user.profile,
                        email: user.email
                    },
                    token: token,
                    redirect: redirect
                };
                return res.status(201).send(successObj);
            }
        });
    });
};

module.exports.signInUser = (req, res) => {
    let redirect = req.body.redirect || false;
    let errorObj = {};
    let successObj = {};

    User.findOne({
        email: req.body.user.email
    }, (err, user) => {
        if (err) {
            winston.error(JSON.stringify(err));
            errorObj = {
                success: false,
                errCode: "0008",
                errMsg: "Failed to sign in user.",
                msg: JSON.stringify(err),
                authenticated: false,
                redirect: "/signin"
            };
            return res.status(500).send(errorObj);
        }

        if (!user) {
            errorObj = {
                success: false,
                errCode: "0009",
                errMsg: "Email or Password is incorrect.",
                authenticated: false,
                redirect: "/signin"
            };
            return res.status(200).send(errorObj);
        }
        
        if (!req.body.authenticate) {
            successObj = {
                success: true,
                msg: "User retrieved successfully.",
                authenticated: false,
                user: {
                    _id: user._id,
                    goals: user.goals,
                    publicGoals: user.publicGoals,
                    roles: user.roles,
                    profile: user.profile,
                    email: user.email
                },
                redirect: redirect
            };
            return res.status(200).send(successObj);
        }

        user.comparePassword(req.body.user.password, (err, isMatch) => {
            if (!isMatch || err) {
                winston.error(JSON.stringify(err));
                errorObj = {
                    success: false,
                    errCode: "0010",
                    errMsg: "Email or Password is incorrect.",
                    msg: JSON.stringify(err),
                    authenticated: false,
                    redirect: "/signin"
                };
                return res.status(200).send(errorObj);
            }

            let token = jwt.sign({
                _id: user._id
            }, settings.api.token.secret, settings.api.token.options);

            res.cookie("token", token);                        
            successObj = {
                success: true,
                msg: "User signed in successfully.",
                authenticated: true,
                user: {
                    _id: user._id,
                    goals: user.goals,
                    publicGoals: user.publicGoals,
                    roles: user.roles,
                    profile: user.profile,
                    email: user.email
                },
                token: token,
                redirect: redirect
            };
            return res.status(200).send(successObj);
        });
    });
};

module.exports.updateUserById = (req, res) => {
    let redirect = req.body.redirect || false;
    let errorObj = {};
    let successObj = {};
    
    User.findOne({
        _id: req.params._id
    }, (err, user) => {
        if (!user) {
            errorObj = {
                success: false,
                errCode: "0013",
                errMsg: "User does not exist.",
                redirect: redirect
            };
            return res.status(404).send(errorObj);
        }

        if (err) {
            winston.error(JSON.stringify(err));
            errorObj = {
                success: false,
                errCode: "0014",
                errMsg: "Failed to update user.",
                msg: JSON.stringify(err),
                redirect: redirect
            };
            return res.status(500).send(errorObj);
        }

        let updateUser = {
            $set: {
                goals: req.body.user.goals,
                publicGoals: req.body.user.publicGoals,
                roles: req.body.user.roles,
                profile: req.body.user.profile
            }
        }

        User.update({
            _id: user._id
        }, updateUser, {
            upsert: false
        }, (err) => {
            if (err) {
                winston.error(JSON.stringify(err));
                errorObj = {
                    success: false,
                    errCode: "0015",
                    errMsg: "Failed to update user.",
                    msg: JSON.stringify(err),
                    redirect: redirect
                };
                return res.status(500).send(errorObj);
            }

            successObj = {
                success: true,
                msg: "User updated successfully.",
                user: {
                    _id: user._id,
                    goals: req.body.user.goals,
                    publicGoals: req.body.user.publicGoals,
                    roles: req.body.user.roles,
                    profile: req.body.user.profile,
                    email: user.email
                },
                redirect: redirect
            };
            res.status(200).send(successObj);
        });
    });
};

module.exports.deleteUserById = (req, res) => {
    let redirect = req.body.redirect || false;
    let errorObj = {};
    let successObj = {};

    User.remove({
        _id: req.params._id
    }, function (err) {
        if (err) {
            winston.error(JSON.stringify(err));
            errorObj = {
                success: false,
                errCode: "0011",
                errMsg: "Error deleting user.",
                msg: JSON.stringify(err),
                redirect: redirect
            };
            return res.status(500).send(errorObj);
        }

        successObj = {
            success: true,
            msg: "User deleted successfully.",
            redirect: redirect
        };
        return res.status(200).send(successObj);
    });
};

module.exports.signOutUser = (req, res) => {
    let redirect = req.body.redirect || false;
    let errorObj = {};
    let successObj = {};

    res.cookie("token", "");

    successObj = {
        success: true,
        msg: "User successfully signed out.",
        redirect: redirect
    };
    return res.status(200).send(successObj);
};