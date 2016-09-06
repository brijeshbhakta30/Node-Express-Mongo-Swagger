//index.js
"user strict";

require('dotenv').config({path: './.env-dev'}); //for development
//require('dotenv').config({path: './.env-prod'}); // for production

const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    expressJwt = require('express-jwt'),
    path = require('path'),
    swagger = require('swagger-express'),
    router = express.Router(),
    server = require('http').Server(app);

// configuration ===============================================================
mongoose.connect(process.env.DB_URL, (err, res) => {
    if(err)
        console.log(`err connecting to db on ${process.env.DB_URL}, err: ${err}`);
    else
        console.log(`database connected on ${process.env.DB_URL}`);
}); // connect to our database

app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//Allow cross origin
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//Swagger Settings
app.use(swagger.init(app, {
    apiVersion: '1.0',
    swaggerVersion: '1.0.5',
    basePath: process.env.BASE_URL,
    swaggerURL: '/swagger',
    swaggerJSON: '/api-docs.json',
    swaggerUI: './public/swagger/',
    //apis: ['./swagger/test.yml']
    apis: ['./swagger/users.yml', './swagger/badges.yml']
}));

//logger
app.use(morgan('dev'));

//JWT token
app.use('/api', expressJwt({ secret: process.env.APP_SECRET }));
app.use('/api', function(req, res, next) {
	var authorization = req.header("authorization");
	var session = JSON.parse( new Buffer((authorization.split(' ')[1]).split('.')[1], 'base64').toString());
    res.locals.session = session;
    next();
});

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('development', () => {
    app.use(express.errorHandler());
});

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// required for passport
app.use(session({
    secret: process.env.APP_SECRET,
    saveUninitialized: true
})); // session secret


// routes ======================================================================
app.use(require('./controllers/index')); // load our routes and pass in our app
//require('./controllers/users');


server.listen(process.env.PORT, () => {
    console.log(`-------------------------------------------------------------------\nServer started successfully!, Open this URL ${process.env.BASE_URL}\n-------------------------------------------------------------------`);
});
