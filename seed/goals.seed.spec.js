"use strict";

require("rootpath")();  

const settings  = require("configs/environments/settings.development");
const frisby    = require("frisby");
const server    = settings.server.http.host;
const port      = settings.server.http.port;
const mongoose  = require("mongoose");
const wait      = 0;  

let goals = [
	{
		"name":"Make an API",
		"category":"development",
		"hashtags":["dev","software"],
		"location":"",
		"img": {
			"preferUpload":false,
			"url":"http://placehold.it/140x100",
			"upload":""
		},
		"private":false
	}
];

for(let goal of goals) {
	goal._id = mongoose.Types.ObjectId();
	frisby.create("Sign Up User")
    .post(`${server}:${port}/api/goals/`,
		{goal:goal}, 
		{json: true})
    .expectStatus(201)
    .waits(wait)
    .toss();
}