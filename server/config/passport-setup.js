const passport = require("passport");
const request = require("request");
const StravaStrategy = require('passport-strava-oauth2').Strategy;
const GoodreadsStrategy = require('passport-goodreads').Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const keys = require("./keys");
const fetch = require('node-fetch');

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
    } else {
      console.log("break")
    }
    user.strava = {
      token: profile.token,
      provider: "strava"
    }
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
    var user = {}
    if (req.user) {
      user = req.user
    } else {
      console.log("break")
    }
    user.goodreads = {
      token: token,
      tokenSecret: tokenSecret,
      id: profile.id,
      provider: "goodreads"
    }
    return done(null, user);
  })
);

passport.use(
  new LocalStrategy({
    callbackURL: "/auth/youversion/redirect",
    passReqToCallback: true
  }, function(req, username, password, done) {
    var user = {}
    if (req.user) {
      user = req.user
    } else {
      console.log("break")
    }
    var cookies = ""
    fetch("https://nodejs.bible.com/oauth/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      }
      return done(null, false, { message: 'Incorrect email or password.' });
    })
    .then(responseJson => {
      if (responseJson.error && responseJson.error == 'access_denied') {
        return done(null, false, { message: 'Incorrect email or password.' });
      }
      
      var options = { method: 'POST',
        url: ' https://my.bible.com/sign-in',
        form: 
        {
          username: username,
          password: password } 
      };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        for (const cookie of response.headers["set-cookie"]) {
          cookies = cookies + " " + cookie.substring(0, cookie.length - 6);
        }
        var options = { method: 'POST',
          url: 'https://my.bible.com/sign-in',
          headers: 
          {
              "Cookie": cookies } 
          };

        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          var youversion_token = ""
          for (const cookie of response.headers["set-cookie"]) {
            if (cookie.indexOf("YouVersionToken2=") == 0) {
              youversion_token = cookie.substring(17, cookie.indexOf(";")-19) + "|:|:|null"
            }
          }
          user.youversion = {
            youversion_token: youversion_token,
            access_token: responseJson.access_token,
            provider: "youversion"
          } 
          done(null, user);
        });

      });
    })
  })
);

passport.use(
  new SpotifyStrategy({
    clientID: keys.spotify.clientID,
    clientSecret: keys.spotify.clientSecret,
    callbackURL: "/auth/spotify/redirect",
    passReqToCallback: true
  }, function(req, accessToken, refreshToken, profile, done) {
    var user = {}
    if (req.user) {
      user = req.user
    } else {
      console.log("break")
    }
    user.spotify = {
      token: accessToken,
      provider: "spotify"
    }
    return done(null, user);
  })
);