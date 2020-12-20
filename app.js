var express = require('express.io'),
	app = express(),
    request = require("request-promise"),
	mongoose = require('mongoose'),
	passport = require('passport'),
	bodyParser = require('body-parser'),
	LocalStrategy = require('passport-local'),
	passportLocalMongoose = require('passport-local-mongoose'),
	User = require('./model/users'),
	Doctor = require('./model/doctors'),
	Job = require('./model/jobs'),
	ContactUs = require('./model/contactUS'),
	login = false,
	Gallery = require('./model/gallery'),
	Course = require('./model/courses');

mongoose.set('useUnifiedTopology', true);
var mongoDB = 'mongodb://localhost/sdk';
mongoose.connect(mongoDB, { useNewUrlParser: true });
app.use(
	require('express-session')({
		secret: 'iitb site shoo',
		resave: false,
		saveUninitialized: false,
	})
);

app.http().io();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'public/images/');
//     },

//     filename: function(req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/',isloginVersion2,function (req, res) {
	res.render('home',{user:req.user,login:login});
});

app.get("/welcome",islogin ,function(req, res){
	res.render("welcome",{user:req.user,login:login});
});

app.get("/login", function(req,res){
	res.render('login');
});

app.get("/callarea/:url",islogin,function(req,res){
	res.render('callarea',{user:req.user,url:req.params.url,login:login});
})
app.post('/login',passport.authenticate('local', {
		successRedirect: '/welcome',
		failureRedirect: '/login',
	}),
	function (req, res) {
		req.body.username;
		req.body.password;
});

app.get('/signup', function (req, res) {
	res.render('signup',{user: req.user,login: login});
});


app.post('/signup', function (req, res) {
	req.body.username;
	req.body.password;
	console.log(req.body.loginas+req.body.email+"xxx");
	User.register(
		new User({username: req.body.username, type: req.body.loginas,email:req.body.email,doctor:{qualification:"MBBS",department:"Cardiology"}}),
		req.body.password,
		function (err, user) {
			passport.authenticate('local')(req, res, function () {
				res.redirect('/welcome');
			});
		});
});

app.get("/countries",isloginVersion2 ,function(req, res){
	res.render("map",{user:req.user,login:login});
});

app.get("/courses",islogin ,function(req,res){
	Course.find({},function(err,courses){
		res.render("courses", {courses: courses,user:req.user,login:login});
	});	
});

app.get("/course/:id",islogin,function(req,res){
	Course.findById(req.params.id,function(err,course){
	res.render("coursecontents",{course: course,user:req.user,login:login});
	});
});

app.get("/doctors",islogin ,function(req, res){
	User.find({type:"doctor"},function(err,doctor){
		res.render("doctors",{user:req.user,login:login,doctor:doctor});
	})
	
});	

app.get("/job_opportunities", islogin,function(req, res){
	Job.find({}, function(err, jobs){
		res.render("job_opportunities", {jobs: jobs,user:req.user,login:login});
	});
});

app.get("/job_opportunities/:id",islogin ,function(req, res){
	Job.findById(req.params.id, function(err, job){
		res.render("job", {job: job,user:req.user,login:login});
	});
});



app.get("/news/:topic", islogin,function(req, res){
	if(req.params.topic === "world"){
		request({url:"http://newsapi.org/v2/top-headlines?q=world&apiKey=b78873f07a0a4e3b81dc51a6d0b6c872"}) 
    .then(response =>{
	var news =  JSON.parse(response);
		res.render("news", {news: news, topic: req.params.topic,user:req.user,login:login});
	//console.log(news.articles[1].source.name);})
	});
	}
	else{
		request({url:"http://newsapi.org/v2/top-headlines?q="+req.params.topic+"&apiKey=b78873f07a0a4e3b81dc51a6d0b6c872"}) 
    .then(response =>{
	var news =  JSON.parse(response);
		res.render("news", {news: news, topic: req.params.topic,user:req.user,login:login});
	//console.log(news.articles[1].source.name);})
	});
	}
	
});

app.get("/aboutus",isloginVersion2 ,function(req, res){
	res.render("aboutus",{user:req.user,login:login});
});

app.get("/contact_us", islogin,function(req, res){
	res.render("contact_us",{user:req.user,login:login});
});

app.get("/gallery/:topic", isloginVersion2,function(req, res){
	var topic = req.params.topic;
	if(topic==="workforce"){
		Gallery.find({title:"Workforce"},function(err,gallery){
			// console.log(gallery);
			res.render("gallery", {topic: topic,user:req.user,login:login,gallery:gallery});
		});
	}
	else if(topic==="education"){
		Gallery.find({title:"Education"},function(err,gallery){
			res.render("gallery", {topic: topic,user:req.user,login:login,gallery:gallery});
		});
	}
	else if(topic==="medical"){
		Gallery.find({title: "medical"},function(err,gallery){
			res.render("gallery", {topic: topic,user:req.user,login:login,gallery:gallery});
		});
	}
	else{
		Gallery.find({title: "unemployment"},function(err,gallery){
			res.render("gallery", {topic: topic,user:req.user,login:login,gallery:gallery});
		});
	}
	// res.render("gallery", {topic: topic,user:req.user,login:login});
});

// doctor = new Doctor({Spec:"MD",Fees:"1000",Rating:"4"});
// doctor.save();

app.get('/logout', function (req, res){
	req.logout();
	res.redirect('/');
});
function isloginVersion2(req, res, next) {
	if (req.isAuthenticated()) {
		User.find({ username: req.user.username }, function (err, user) {
			if (err) {
				console.log('shit sorry');
			}
			login = true;
			
		});
		return next();
	} else {
		login = false;
		return next();
		
	}
}
	
function islogin(req, res, next) {
	if (req.isAuthenticated()) {
		User.find({ username: req.user.username }, function (err, user) {
			if (err) {
				console.log('shit sorry');
			}
			login = true;
			
		return next();
	} )}
	else {
		login = false;
		res.redirect('/');
	}
}

app.get("/call", islogin, function(req, res){
	res.render("call", {user: req.user,login: login  })
})
	
app.io.route('ready', function (req) {
	req.io.join(req.data.chat_room);
	req.io.join(req.data.signal_room);
	req.io.join(req.data.files_room);
	app.io.room(req.data).broadcast('arrival', {
		message: 'peer is cominggggggg' + req.data + ' here',
	});
});

//-----------------------------send is emitted--------------------------------------------------------------
app.io.route('send', function (req) {
	
	app.io.room(req.data.room).broadcast('message', {
		message: req.data.message,
		author: req.data.author,	
	});
});

//-----------------------------------signal is emitted--------------------------------------------------------
app.io.route('signal', function (req) {
	req.io.room(req.data.room).broadcast('signaling_message', {
		type: req.data.type,
		message: req.data.message,
	});
});

//------------------------------------------files is emited-------------------------------------------------
app.io.route('files', function (req) {
	req.io.room(req.data.room).broadcast('files', {
		filename: req.data.filename,
		filesize: req.data.filesize,
	});
});

app.get("/create_link", isloginVersion2, function(req, res){
	res.render("create_link", {user: req.user,login: login,url:Math.floor(Math.random() * 100000000000000)});
});

app.listen(3000,function(){
	console.log("server started");
});