var mongoose = require("mongoose");;

var courseschema = new mongoose.Schema({
	Title  : String,
	Desc   : String,
	Img    : String,
	Author : String,
	Author_id : String,
	Content: [{
		Title: String,
		Desc : String,
		Link : String,
	}],	
});
module.exports = mongoose.model("Course", courseschema);