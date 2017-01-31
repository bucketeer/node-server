"use strict";

require("rootpath")();

const jwt = require("jsonwebtoken");
const User = require("components/api/users/users.model");
const settings = require(`configs/environments/settings.${process.env.NODE_ENV || "development"}`);
const winston = require("winston");

module.exports.isAuthenticated = (req, res, next) => {
    if (!settings.api.authenticate) {
        return next();
    }

    let token = req.headers.jwt_token;
    if (!token) {
        let errorObj = {
            success: false,
            errMsg: "User must be signed in to perform this function."
        };
        return res.status(401).send(errorObj);
    }

    jwt.verify(token, settings.api.token.secret, (err) => {
        if (err) {
            winston.error(JSON.stringify(err));
            return res.status(400).send({
                msg: "Unable to verify token."
            });
        }
        return next();
    });
};

module.exports.isAdmin = (req, res, next) => {
    if (!req.headers.token) {
        let errorObj = {
            success: false,
            errMsg: "User does not have the correct privilege to perform this action."
        };
        return res.status(401).send(errorObj);
    }

    next();
};