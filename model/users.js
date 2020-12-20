var mongoose = require("mongoose"),
	passportLocalMongoose = require("passport-local-mongoose");;

var userschema = new mongoose.Schema({
	username : String,
	password : String,
	type     : String,
	name     : String,
	DOB      : String,
	img      : String,
	email:String,
	doctor:{
		qualification:String,
		department:String
	}
	
});
userschema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userschema);