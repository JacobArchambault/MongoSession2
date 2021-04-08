var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/userlist');  

var userSchema = new mongoose.Schema({
	username: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	first_name: {type: String, required: true},
	last_name: {type: String, required: true},
	city: {type: String, required: true},
	dob: {type: Date, required: true},
	preference: {type: String, required: true},
	violations: {type: Number, required: true}
});

userSchema.virtual('user_age').get(function() {  
	var years = Date.now() - this.dob;
	return Math.floor(years / 1000/ 60 / 60 / 24 / 365);
});

userSchema.virtual('full_name').get(function() {  
     return this.first_name + " " + this.last_name;
});

module.exports = mongoose.model('User', userSchema);


