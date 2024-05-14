const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
// const flash = require('express-flash');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
},
  async function (req, email, password, done) {
    try {
      let user = await User.findOne({ email: email })
      if (!user) {
       req.flash('error', 'invalid username // password');
        return done(null, false);
      }
      if (user.password != password) {
        req.flash('error', 'invalid password');
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      req.flash('error', err);
      return done(err);
    }

  }));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(async function (id, done) {
  try {
    let user = await User.findById(id);
    if (!user) {
      return done(null, false)
    }
    return done(null, user);
  } catch (error) {
    done(err);
  }
});

passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log('error', 'You are not Authorize plz sign in !');
  return res.redirect('/users/sign-in');
}
  passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
      res.locals.user = req.user;
    }
    next();
  }

module.exports = passport;



// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const User = require('../models/user');

// //authentication using passport js

// passport.use(new LocalStrategy({
//     usernameField: 'email'
// }, function (email, password, done) {
//     // Wrap the User.findOne operation in a promise
//     const findUser = new Promise((resolve, reject) => {
//         User.findOne({ email: email }, function (err, user) {
//             console.log('i am here');
//             if (err) {
//                 console.log('err in finding user --> passport');
//                 reject(err);
//             } else if (!user || user.password !== password) {
//                 console.log("Invalid password");
//                 reject(null, false);
//             } else {
//                 console.log("successfully found user");
//                 resolve(user);
//             }
//         });
//     });

//     // Use the promise with .then and .catch
//     findUser
//         .then((user) => {
//             return done(null, user);
//         })
//         .catch((err) => {
//             return done(err);
//         });
// }));


// //Serializing the user to decide which key is to be kept in cookie

// passport.serializeUser(function(user, done){
//     done(null, user.id);
// });

// //deserializing the user from key in the cookie
// passport.deserializeUser(function(id, done){
//     User.findById(id, function(err, user){
//         if(err){
//             console.log("err in finding user --> passport");
//             return done(err);
//         }
//         return done(null, user);

//     });
// });

// module.exports = passport;