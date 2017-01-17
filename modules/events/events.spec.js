"use strict";

require("rootpath")();

const settings  = require("configs/environments/settings.development");
const frisby    = require("frisby");
const server    = settings.server.http.host;
const port      = settings.server.http.port;
const mongoose  = require("mongoose");
const uuid      = require("uuid");
const testId    = mongoose.Types.ObjectId();
const groupId   = uuid.v1();
const wait      = 0;   

frisby.create("Get Events")
    .get(`${server}:${port}/api/events`)
    .inspectRequest()
    .expectStatus(200)
    .expectJSONTypes({
    	success: Boolean, msg: String, events: Array
    })
    .afterJSON((res) => {
        
    }) 
    .waits(wait)
    .toss();

frisby.create("Create Event")
    .post(`${server}:${port}/api/events`,
        {
            event: {
                _id: testId,
                groupId: groupId,
                type: `test`,
            	text: `${testId} - ${groupId}`,
                success: true                                               
            }
        }, 
        {json: true})
    .inspectRequest()
    .expectStatus(201)
    .expectJSONTypes({
    	success: Boolean, msg: String, event: Object
    })
    .afterJSON((res) => {
        
    }) 
    .waits(wait)
    .toss();

frisby.create("Delete Event By Id")
    .delete(`${server}:${port}/api/events/${testId}`,
        {}, 
        {json: true})
    .inspectRequest()
    .expectStatus(200)
    .expectJSONTypes({
    	success: Boolean, msg: String
    })
    .afterJSON((res) => {
        
    }) 
    .waits(wait)
    .toss();

