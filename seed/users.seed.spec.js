"use strict";

require("rootpath")();

const settings  = require("configs/environments/settings.development");
const frisby    = require("frisby");
const server    = settings.server.http.host;
const port      = settings.server.http.port;
const mongoose  = require("mongoose");
const uuid      = require("uuid");
const testId    = mongoose.Types.ObjectId();
const testEmail = `${new Date().getMilliseconds().toString()}@email.com`;
const wait      = 0;  

let users = [
	{			
		"_id":"",
		"email": testEmail, 
		"password": "password",
		"goals":["587aabfeb33172f18d68286f"],
		"roles":[],
		"profile": {
			"username": "avarghese",
			"name": "arun varghese",
			"gender": "Male",
			"location": "Dallas, TX",
			"media": {
				"preferUpload":false,
				"url":"http://placehold.it/140x100",
				"img":""
			},
		}
	}
];

for(let user of users) {
	user._id = mongoose.Types.ObjectId();
	frisby.create("Sign Up User")
    .post(`${server}:${port}/api/users/signup`,
        {user: user}, 
        {json: true})    
    .expectStatus(201)
    .waits(wait)
    .toss();
}