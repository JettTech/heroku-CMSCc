var mongoose = require("mongoose");

// Model Schema for Category :
var CategorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String
  },
  sorting: {
	type: Number
  }
});
var Category = mongoose.model("Category", CategorySchema);
module.exports = Category;