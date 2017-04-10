var express 	= require('express')
var app 		= express()
var path 		= require('path')
var morgan 		= require('morgan')
var mongoose 	= require('mongoose')
var bodyParser 	= require('body-parser')
var passport 	= require('passport')
var port 		= process.env.PORT || 5000

var config 				= require('./config')
var authenticateToken	= require('./middlewares/authenticateToken')
var social				= require('./passport')(app, passport)
var routeApi 			= require('./routes/api')
var routeUser 			= require('./routes/user')
var viewRoutes 			= require('./routes/viewRoutes')


app.engine('html', require('ejs').renderFile) // Setting ejs as render engine

app.set('view engine', 'html') // Setting the index.html of views as main of our website
app.set('views', __dirname + '/views') // Setting folder of views

app.use(morgan('dev'))
app.use(bodyParser.json()) //for parsing aplication/json
app.use(bodyParser.urlencoded({extended:true})) //for parsin aplication/x-ww-form-urlencoded
app.use(express.static(__dirname + '/public')) // Setting folder of files statics
app.use(express.static(__dirname + '/views')) // Setting folder of views
app.use('/', routeUser) // Routes Login
app.use('/api/user', authenticateToken, routeApi) // Routes User
// app.use('/', viewRoutes)

// Database configuration
mongoose.Promise = global.Promise
mongoose.connect(config.database.mlab, function(err){
	if (err) {
		console.log('An error occurred while connecting with database!')
		console.log(err)
	}

	console.log('Success connection with database!!')
})

// Redirect other address navigation to index
app.get('*', function(req, res){
	res.render('index')
})

// Server port configuration
app.listen(port, function(err){
	if (err) {
		console.log('An error occurred while starting server')
		console.log(err)
	}

	console.log('Running the server in the port: '+port)
})