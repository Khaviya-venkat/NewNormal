var mongoose = require("mongoose");;

var galleryschema = new mongoose.Schema({
	Url  : String,
	title:String
});
module.exports = mongoose.model("Gallery", galleryschema);