//ROLE OF THE Controller.JS FILE
// ===========================================================
//This CONNECTS the front-end/Client-end TO THE back END.
//...and "ROUTES" the request to the correct "extention," which leads to a chain
//  of sequential functions (between burger.js, and orm.js), which alter
//    the database && WEB-client display through "CRUD" stage/state changes.


// Dependencies
// ===========================================================
var express = require("express");
var router = express.Router(); //LOOK INTO THE EXPRESS NPM "ROUTER() Method"

// LOCAL REQUIREs (local files to require on over...)
// =========================================================== 
var burger = require("../models/burger.js");


// Routes
// =========================================================== 
router.get("/", function(req, res) {
  res.redirect("/burgers");
});

router.get("/burgers", function(req, res) {
  // express callback response by calling burger.selectAllBurger
  burger.all(function(burgerData) {
    // wrapper for orm.js that using MySQL query callback will return burger_data, render to index with handlebar
    res.render("index", { burger_data: burgerData });
  });
});

// post route -> back to index
router.post("/burgers/create", function(req, res) {
  // takes the request object using it as input for buger.addBurger
  burger.create(req.body.burger_name, function(result) {
    // wrapper for orm.js that using MySQL insert callback will return a log to console,
    // render back to index with handle
    console.log(result);
    res.redirect("/");
  });
});

// put route -> back to index
router.put("/burgers/:id", function(req, res) {
  burger.update(req.params.id, function(result) {
    // wrapper for orm.js that using MySQL update callback will return a log to console,
    // render back to index with handle
    console.log(result);
    // Send back response and let page reload from .done in Ajax
    res.sendStatus(200);
  });
});

module.exports = router;//exporting the router, and all its routes (for ue on the server.js)