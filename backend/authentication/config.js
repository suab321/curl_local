const passport = require('passport');
const google = require('passport-google-oauth20').Strategy;

const {User} = require("../DataBase/db");
const db = require('../DataBase/db');

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser(async(id,done)=>{
    const user = await User.findById({_id:id});
    done(null,user);
});


passport.use(new google({
    clientID:process.env.client_id,
    clientSecret:process.env.client_secret,
    callbackURL:`http://localhost:3002/authentication/google_redirect`
},
async function(accessToken, refreshToken, profile, done){
    if(profile){
        const user = await User.findOne({social_Id:profile.id});
        if(user === null){
            const user = new User;
            user.name = profile.displayName;
            user.social_Id = profile.id;
            try{
                const res = await user.save();
                done(null, res);
            }catch(err){
                done(err,null);
            }
        }
        else
            done(null,user);
    }
}
));