const passport = require('passport');
const googelStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
const env = require('./envoirnment');


passport.use(new googelStrategy({
    clientID :env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: env.google_call_back_url,
},

async function(accessToken, refreshToken, profile, done) {
    try {
        const user = await User.findOne({ email: profile.emails[0].value }).exec();
        if (user) {
            return done(null, user);
        } else {
            const newUser = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            });
            return done(null, newUser);
        }
    } catch (err) {
        console.log('Error occurred', err);
        return done(err, null);
    }
}));
    // async function(accessToken, refreshToken, profile, done){
    //     try{
    //         const User = await User.findOne({email: profile.emails[0].value}).exec(function(err, User){
    //             if(err){console.log('Error', err); return;}

    //             console.log(profile);
    //             if(user){
    //                 return done(null, User);
    //             }else{
    //                 User.create({
    //                     name: profile,
    //                     email: profile.emails[0].value,
    //                     password: crypto.randomBytes(20).toString('hex')
    //                 })
    //                     return done(null, User);
    //             }
    //         })
    //     }
    //     catch(err){
    //         console.log('Error occured', err);
    //     }
    // }
    // ));

    module.exports = passport;
