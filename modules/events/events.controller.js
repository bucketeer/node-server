"use strict";

require("rootpath")();

const Event = require("modules/events/events.model");
const settings = require(`configs/environments/settings.${process.env.NODE_ENV || "development"}`);
const select = "_id groupId type text success";
const winston = require("winston");

module.exports.getEvents = (req, res) => {
    let redirect = req.body.redirect || false;
    let errorObj = {};
    let successObj = {};
    let pageSize = parseInt(req.query.pageSize || settings.api.results.defaultPageSize || 1);
    let page = parseInt(req.query.page || 0);
    let filter = {};
    if (req.query._id) {
        filter._id = req.query._id;
    }
    if (req.query.groupId) {
        filter.groupId = req.query.groupId;
    }
    Event.paginate(filter, {
        select,
        offset: page * pageSize,
        limit: pageSize
    }, (err, events) => {
        if (err) {
            winston.error(JSON.stringify(err));
            errorObj = {
                success: false,
                errCode: "0001",
                errMsg: JSON.stringify(err),
                msg: "Failed to get events.",
                redirect: redirect
            };
            return res.status(500).send(errorObj);
        }
        successObj = {
            success: true,
            msg: "Events retrieved successfully.",
            events: events.docs,
            totalResults: events.total,
            pageSize: pageSize,
            page: page,
            nextPage: `${settings.server.http.host}:${settings.server.http.port}/api/events?page=${page+1}`,
            previousPage: (page - 1 < 0) ? false : `${settings.server.http.host}:${settings.server.http.port}/api/events?page=${page-1}`,
            redirect: redirect
        };
        return res.status(200).send(successObj);
    });
};

module.exports.createEvent = (req, res) => {
    let redirect = req.body.redirect || false;
    let errorObj = {};
    let successObj = {};
    if (!req.body.event) {
        errorObj = {
            success: false,
            errCode: "0002",
            msg: "No event data supplied",
            redirect: redirect
        };
        return res.status(400).send(errorObj);
    }
    let event = new Event({
        groupId: req.body.event.groupId,
        type: req.body.event.type,
        text: req.body.event.text,
        success: req.body.event.success
    });
    if (req.body.event._id) {
        event._id = req.body.event._id;
    }
    event.save(function (err) {
        if (err && err.name === "ValidationError") {
            winston.error(JSON.stringify(err.errors));
            errorObj = {
                success: false,
                errCode: "0006",
                errMsg: JSON.stringify(err.errors),
                msg: "Validation error creating event.",
                redirect: redirect
            };
            return res.status(400).send(errorObj);
        } else if (err) {
            winston.error(JSON.stringify(err));
            errorObj = {
                success: false,
                errCode: "0007",
                errMsg: JSON.stringify(err),
                msg: "Error creating event.",
                redirect: redirect
            };
            return res.status(500).send(errorObj);
        } else {
            successObj = {
                success: true,
                msg: "Event created successfully.",
                event: {
                    groupId: event.groupId,
                    type: event.type,
                    text: event.text,
                    success: event.success
                },
                redirect: redirect
            };
            res.status(201).send(successObj);
        }
    });
};

module.exports.deleteEventById = (req, res) => {
    let redirect = req.body.redirect || false;
    let errorObj = {};
    let successObj = {};
    Event.remove({
        _id: req.params._id
    }, function (err) {
        if (err) {
            winston.error(JSON.stringify(err));
            errorObj = {
                success: false,
                errCode: "0011",
                errMsg: JSON.stringify(err),
                msg: "Error deleting event.",
                redirect: redirect
            };
            return res.status(500).send(errorObj);
        }
        successObj = {
            success: true,
            msg: "Event deleted successfully.",
            redirect: redirect
        };
        res.status(200).send(successObj);
    });
};