"use strict";

require("rootpath")();

const settings = require("configs/environments/settings.development");
const frisby    = require("frisby");
const server    = settings.server.http.host;
const port      = settings.server.http.port;
const mongoose  = require("mongoose");
const testEmail = `${new Date().getMilliseconds().toString()}@email.com`;
const testId    = mongoose.Types.ObjectId();
const wait      = 0;   

frisby.create("Get Users")
    .get(`${server}:${port}/api/users`)
    .inspectRequest()
    .expectStatus(200)
    .expectJSONTypes({
    	success: Boolean, msg: String, users: Array
    })
    .afterJSON(function(data){
    
    })
    .waits(wait)
    .toss();

frisby.create("Sign Up User")
    .post(`${server}:${port}/api/users/signup`,
        {
            user: {
            	_id: testId,
            	email: testEmail, 
            	password: "password",                
            	profile: {
                    img: {
                        url: "url here"
                    },
            		username: testEmail.replace("@email.com",""),
            		name: "First Last",
            		gender: "Male",
            		location: "Dallas, TX"
            	}
            }
        }, 
        {json: true})
    .inspectRequest()
    .expectStatus(201)
    .expectJSONTypes({
    	success: Boolean, msg: String, authenticated: Boolean, user: Object, token: String 
    })
    .afterJSON(function(data){

    })
    .waits(wait)
    .toss();

frisby.create("Sign In User No Authenticated")
    .post(`${server}:${port}/api/users/signin`,
        {
            authenticate: false,
            user: {
                email: testEmail, 
                password: "password",
            }
        }, 
        {json: true})
    .inspectRequest()
    .expectStatus(200)
    .expectJSONTypes({
        success: Boolean, msg: String, authenticated: Boolean, user: Object 
    })
    .afterJSON(function(data){
        expect(data.authenticated).toBe(false);
    })
    .waits(wait)
    .toss();

frisby.create("Sign In User Authenticated")
    .post(`${server}:${port}/api/users/signin`,
        {
            authenticate: true,
            user: {
                email: testEmail, 
                password: "password",
            }
        }, 
        {json: true})
    .inspectRequest()
    .expectStatus(200)
    .expectJSONTypes({
        success: Boolean, msg: String, authenticated: Boolean, user: Object, token: String 
    })
    .afterJSON(function(data){
        expect(data.authenticated).toBe(true);
    })
    .waits(wait)
    .toss();

frisby.create("Update User By Id")
    .put(`${server}:${port}/api/users/${testId}`,
        {
        	user: {
                roles: ["admin"],
	        	profile: {
                    img: {
                        url: "url2 here"
                    },
	        		username: testEmail.replace("@email.com",""),
	        		name: "First Last",
	        		gender: "Male",
	        		location: "New Location"
	        	}
        	}
        }, 
        {json: true})
    .inspectRequest()
    .expectStatus(200)
    .expectJSONTypes({
    	success: Boolean, msg: String, user: Object
    })
    .afterJSON((res) => {
        
    })        
    .waits(wait)
    .toss();

frisby.create("Delete User By Id")
    .delete(`${server}:${port}/api/users/${testId}`,
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

