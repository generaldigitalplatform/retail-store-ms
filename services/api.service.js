"use strict";

const ApiGateway = require("moleculer-web");

module.exports = {
	name: "api",
	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
	settings: {
		port: process.env.PORT || 3000,

		routes: [{
			path: "",
			aliases:{
				"REST /customer":"customer",
				"REST /sms":"sms"
			}
		}],

		// Serve assets from "public" folder
		assets: {
			folder: "public"
		},
		 // Global error handler
		 onError(req, res, err) {
            res.setHeader("Content-Type", "text/plain");
            res.writeHead(501);
            res.end("Global error: " + err.message);
        }
	}
};
