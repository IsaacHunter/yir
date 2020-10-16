const passport = require("passport");
const StravaStrategy = require('passport-strava-oauth2').Strategy;
const GoodreadsStrategy = require('passport-goodreads').Strategy;
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
    callbackURL: '/auth/strava/redirect',
    passReqToCallback: true
  }, function(req, accessToken, refreshToken, profile, done) {
    var user = {}
    if (req.user) {
      user = req.user
    }
    user.strava = profile
    return done(null, user);
  })
);

passport.use(
  new GoodreadsStrategy({
    consumerKey: keys.goodreads.consumerKey,
    consumerSecret: keys.goodreads.consumerSecret,
    callbackURL: "/auth/goodreads/redirect",
    passReqToCallback: true
  }, function(req, token, tokenSecret, profile, done) {
    profile.token = token;
    profile.tokenSecret = tokenSecret;
    var user = {}
    if (req.user) {
      user = req.user
    }
    user.goodreads = profile
    return done(null, user);
  })
);