"use strict";

require("rootpath")();

const settings = require("configs/environments/settings.development");
const frisby = require("frisby");
const server = settings.server.http.host;
const port = settings.server.http.port;
const mongoose = require("mongoose");
const testId = mongoose.Types.ObjectId();
const wait = 0;

frisby.create("Get Goals")
    .get(`${server}:${port}/api/goals`)
    .inspectRequest()
    .expectStatus(200)
    .expectJSONTypes({
        success: Boolean,
        msg: String,
        goals: Array
    })
    .afterJSON((res) => {

    })
    .waits(wait)
    .toss();

frisby.create("Create Goal")
    .post(`${server}:${port}/api/goals`, {
        goal: {
            _id: testId,
            name: "testGoal",
            category: "testCategory",
            media: {
                url: "url here"
            }
        }
    }, {
        json: true
    })
    .inspectRequest()
    .expectStatus(201)
    .expectJSONTypes({
        success: Boolean,
        msg: String,
        goal: Object
    })
    .afterJSON((res) => {

    })
    .waits(wait)
    .toss();

frisby.create("Get Goals By Id List")
    .get(`${server}:${port}/api/goals?ids=${testId}&ids=${testId}`)
    .inspectRequest()
    .expectStatus(200)
    .expectJSONTypes({
        success: Boolean,
        msg: String,
        goals: Array
    })
    .afterJSON((res) => {

    })
    .waits(wait)
    .toss();

frisby.create("Update Goal By Id")
    .put(`${server}:${port}/api/goals/${testId}`, {
        goal: {
            name: "goal2",
            description: "description",
            category: "category2",
            hashtags: ["tag1"],
            media: {
                url: "url2 here"
            },
            completed: {
                status: true,
                date: new Date()
            }
        }
    }, {
        json: true
    })
    .inspectRequest()
    .expectStatus(200)
    .expectJSONTypes({
        success: Boolean,
        msg: String,
        goal: Object
    })
    .afterJSON((res) => {

    })
    .waits(wait)
    .toss();

frisby.create("Delete Goal By Id")
    .delete(`${server}:${port}/api/goals/${testId}`, {}, {
        json: true
    })
    .inspectRequest()
    .expectStatus(200)
    .expectJSONTypes({
        success: Boolean,
        msg: String
    })
    .afterJSON((res) => {

    })
    .waits(wait)
    .toss();