var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

// Model Schema for Page :
var PageSchema = mongoose.Schema({
	title: {
		type: String,
		// unique: true,
		required: true
	},
	slug: {
		type: String
	},
	content: {
		type: String,
		required: true
	},
	sorting: {
		type: Number
	}

});
// PageSchema.plugin(uniqueValidator);

//This accomplishes the same goal as below: var Page = module.exports = mongoose.model("Page", PageSchema);

var Page = mongoose.model("Page", PageSchema);
module.exports = Page;


