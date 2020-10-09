const passport = require("passport");
const StravaStrategy = require('passport-strava-oauth2').Strategy;
const keys = require("./keys");
// const User = require("../models/user-model");

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
  done(null, user);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {
  // User.findById(id)
  //   .then(user => {
  //     done(null, user);
  //   })
  //   .catch(e => {
  //     done(new Error("Failed to deserialize an user"));
  //   });
  done(null, id)
});

passport.use(
  new StravaStrategy({
    clientID: keys.strava.clientID,
    clientSecret: keys.strava.clientSecret,
    callbackURL: '/auth/strava/redirect'
  }, function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  })
);
