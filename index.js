/*    sessions    uses both mongoose and express-handlebars  */
/*    also, you will have needed to have already run the addusers 
      program to establish the database records used for this example. */
const express = require('express');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const app = express();
app.engine('handlebars', expressHandlebars({
	defaultLayout: 'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

app.set('view engine', 'handlebars');

/* also:   npm install @handlebars/allow-prototype-access  */

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

const User = require('./modules/User.js');
const getJoke = require('./modules/jokebank.js');

// storing session data in MemoryStore; use for development purposes only 
session = require('express-session');  
app.use(session({secret: 'random text', resave: true, saveUninitialized: true}))


app.get('/', function(req, res){
	
   if(req.session.loggedIn){
      res.render('homePage', {name: req.session.name, age: req.session.age, flavor: req.session.flavor})
   } else {
      res.render('loginForm');
   } 
   
});


app.post('/login', function(req, res){  
	   
	username = req.body.username;   
	User.findOne( {username: username, password: req.body.password}, function(err, user) {  // test username & pw
		if (err) {
		    res.render('errorPage', {msg : err});
		}
		else if (!user) {
		    res.render('errorPage', {msg : "No user with these credentials. Please log in."});
		}
		else {                                  // user is in database       
			req.session.loggedIn = username;        // set loggedIn session variable to username
		    req.session.flavor = user.preference;   // get flavor, age, fullname from db, set in session
			req.session.age = user.user_age;
			req.session.name = user.full_name;			
    		res.render('homePage', {name: req.session.name, age: req.session.age, flavor: req.session.flavor} ); 
		}
    });   
	
});


app.use("/findusers", function(req, res){

	if(req.session.loggedIn){    // if logged in
	
	    if(req.method == 'GET') {    // GET request returns a template with a HTML form
		    res.render('findUsersForm');	
	    }
	    else if (req.method == 'POST') {      // this is an Axios post request
		    const range = req.body.violationRange;
		
			if(range == "more") 
				query = {violations: {$gte: 5}};   // set the query object for >= 5
			else
				query = {violations: {$lt: 5}};    // set filter object for less than 5
			
			User.find( query, function(err, violators) {  
				if (err) {
					res.render('errorPage', {msg : err});
				}
				else if (!violators) {
					res.render('errorPage', {msg : "No users with this issue. "});
				}
				else { 
					res.send(violators);   // send the array of objects back to the axios request
				}                     // the data will be formatted as html on the client, no template needed
			});  	
		
		}
	}
	else {
		res.render('loginForm');    // not logged in?, redirect
	}
	
	
});


app.get('/jokes', function(req, res){
   if(req.session.loggedIn){
	   oneJoke = getJoke();     // get a joke from jokebank module
       res.render('jokesPage', {joke: oneJoke, name: req.session.name, flavor: req.session.flavor})
   } else {
       res.render('loginForm');
   } 
});


app.post('/updateFlavor', function(req, res){  
	   
	username = req.session.loggedIn;   // username assumed unique
	newFlavor = req.body.flavor
	
	User.findOneAndUpdate({ username : username }, {$set:{preference: newFlavor}}, function(err, doc){
    	if(err){
        	res.render('errorPage', {msg : err});
    	}
	
		req.session.flavor = newFlavor;   // set new flavor in session
    	res.render('homePage', {name: req.session.name, flavor: req.session.flavor, age: req.session.age} )
	});								  

});


app.post('/logout', function(req, res) {   // cancels session
	req.session.destroy();    // invalidate the session cookie and release the session data
	res.render('loginForm');
});


app.listen(3000,  function() {
	console.log('Listening on port 3000, ctrl-c to quit');
    });
