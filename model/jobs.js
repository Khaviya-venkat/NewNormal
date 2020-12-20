var mongoose = require("mongoose");;

var jobschema = new mongoose.Schema({
	post_available  : String,
	company_name   : String,
	dept    : String,
	desc      : String,
	requirements:[String],
	Seekers  : [{
		Name     : String,
		id       : String,
		Progress : String,
		MyViews  : String,
	}],
	
	
});
module.exports = mongoose.model("Job", jobschema);