//Module.exports === Node's way of exporting info to use in other files
module.exports = {
	database: process.env.MONGODB_URI || "mongodb://localhost/cmsConstructionCart"
}

///////// Second Way of Exporting (>> for Heroku)
// var mongoose = require("mongoose");
// var connection;

// if(process.env.MONGODB_URI) {
// 	connection = process.env.MONGODB_URI;
// }
// else {
// 	connection = "mongodb://localhost/cmsConstructionCart";
// }

// mongoose.Promise = Promise;
// mongoose.connect(connection, {useMongoClient: true});
// var db = mongoose.connection;

// db.on("error", console.error.bind(console, "connection error: "));
// db.once("open", function() {
// 	console.log("We have a green Light for the data storage. We are now connected to MongoDB.")
// })

// module.exports = connection;