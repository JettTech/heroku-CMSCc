var mongoose = require("mongoose");

// Model Schema for Category :
var ProductSchema = mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	slug: {
		type: String
	},
	description: {
		type: String,
		required: true
	},
	category: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	image: {
		type: String
	}

});
var Product = mongoose.model("Product", ProductSchema);
module.exports = Product;

