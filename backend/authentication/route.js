require('dotenv').config();

const router = require('express').Router();
const passport = require('passport');

const frontURL = process.env.front_url;


router.get("/google_login", passport.authenticate('google', {scope:['profile']}));

router.get("/google_redirect", passport.authenticate('google'), async(req,res)=>{
    req.session.user = req.user;
    res.redirect(`${frontURL}`);
});

module.exports={
    authentication:router
}