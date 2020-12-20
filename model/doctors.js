var mongoose = require("mongoose");;

var doctorschema = new mongoose.Schema({
	Spec      : String,
	Fees      : String,
	Rating    : String,
	id     : String,
	Patients  : [{
		Name    : String,
		id      : String,
		Problem : String,
		MyViews : String,
	}],
});
module.exports = mongoose.model("Doctor", doctorschema);