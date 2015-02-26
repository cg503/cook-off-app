var express = require('express');
var router = express.Router();
var validate = require('isvalid-express');
var iz = require('iz'),
	are = iz.are,
	validators = iz.validators;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
	res.render('helloworld', {title: 'Hello, World!' })
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
	var db = req.db;
	var collection = db.get('usercollection');
	collection.find({},{},function(e,docs){
		res.render('userlist', {
			"userlist" : docs
		});
	});
});

/* GET New User page. */
router.get('/newuser', function(req,res) {
	res.render('newuser', { title: 'Add New User' });
});

/* GET Meatballs page. */
router.get('/meatballs/:meatball_ID', function(req,res) {
	var meatball_ID = req.params.meatball_ID;
	var food = "meatballs";
	res.render('meatballs', { title: 'Vote for Meatball ' + meatball_ID , ID: meatball_ID , food: food });
});

/*GET Complete page. */
router.get('/complete', function(req,res) {
	res.render('complete', {title: 'Thank you for voting!' });
});

/* GET Invalid vote page. */
router.get('/invalid', function(req,res) {
	res.render('invalid', {title: 'Please only rate on a scale of 1-10. You vote has not been recorded. Try again.'});
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {
	// Set our internal DB variable
	var db = req.db;
	
	// Get our form values. These rely on the "name" attributes
	var userName = req.body.username;
	var userEmail = req.body.useremail;
	
	// Set our collection
	var collection = db.get('usercollection');
	
	
	// Submit to the DB
	collection.insert({
		"username" : userName,
		"email" : userEmail
	}, function (err, doc) {
		if (err) {
			// If it failed, return error
			res.send("There was a problem adding the information to the database.")
		}
		else {
			// If it worked, set the header so the address bar doesn't still say /adduser
			res.location("userlist");
			// And forward to success page
			res.redirect("userlist");
		}
	});
});

/* POST to Meatball Service */
router.post('/meatballs', function(req, res) {
	console.log("here");
	// Set our internal DB variable
	var db = req.db;
	
	// Get our form values. These rely on the "name" attributes
	var meatball_ID = req.body.meatball_ID;
	var sauce = req.body.sauce;
	var originality = req.body.originality;
	var taste = req.body.taste;
	var texture = req.body.texture;
	var food = req.body.food;
	
	// Validate vote values with stupid old library that didn't work
	var voteSauceValidationSchema = {
		"sauce": { type: 'array', len: '1-5', required: true }
	};
	
	router.post('meatballs/:meatball_ID', validate.body(voteSauceValidationSchema), function(req, res) {
		// req.body is now validated and no further validation needs to take place.
		// If body could not be validated and error was sent to the express error handler.
	});
	
	// Validate vote values with new iz library. (trying it without this code)
	
	//Set error
	if (iz.between(sauce, 1,5) == false) { 
		err = 'error';
	}
	else {
		console.log('all good');
	}
	
	// Set our collection
	var collection = db.get('cookoffdata');
	
	// Submit to the DB
	collection.insert({
		"meatball_ID" : meatball_ID,
		"sauce" : sauce,
		"originality" : originality,
		"taste" : taste,
		"texture" : texture,
		"food" : food
		
	}, function (err, doc) {
		if (iz.between(sauce, 1,10) == false) { 
	
			// If it failed, return error
			res.send("There was a problem adding the information to the database.")
		}
		else {
			// If it worked, set the header so the address bar doesn't still say /meatballs
			res.location("complete");
			// And forward to success page
			res.redirect("complete");
		}
	});
});

module.exports = router;
