const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
// const ExtractJWT = require('passport-jwt').ExtractJWT;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const env = require('./envoirnment');



const User = require('../models/user');
const { Strategy } = require('passport-local');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwt_secret
}

passport.use(new JWTStrategy(opts, function(jwtPayLoad, done){
    try{

        User.findById(jwtPayLoad._id, function(err, user){
            if(err){console.log('Error in finding user from JWT'); return;}
    
            if(User){
                return done(null, user);
            }
            else{
                return done(null, false);
            }
        })
    }
    catch(err){
        console.error('Error finding post:', err)
    }
}));

module.exports = passport;