var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

// Model Schema for Page :
var UserSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	admin: {
		type: Number
	}

});

//This accomplishes the same goal as below: var User = module.exports = mongoose.model("User", UserSchema);
var User = mongoose.model("User", UserSchema);
module.exports = User;


