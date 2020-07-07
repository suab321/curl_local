require("dotenv").config();

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo')(session);
const cors = require('cors');
const passport = require("passport");


const {streamRoute} = require('./DataBase/db');
const {authentication} = require('./authentication/route');
const {api} = require("./user_route/route");
require('./authentication/config');

const app = express();

const sessionObj = session({
    secret:process.env.session_secret,
    saveUninitialized:false,
    resave:false,
    store:new mongoStore({mongooseConnection:mongoose.connection}),
    cookie:{
        maxAge:1000*60*60*2,
        httpOnly:true
    }
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin",  `${process.env.front_url}`);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Credentials","true")
       next();
 });


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(sessionObj);
app.use(passport.initialize());
app.use(passport.session());

app.use("/authentication", authentication);
app.use("/api", api);
app.use("/stream", streamRoute)



app.listen(process.env.PORT || 3002);



