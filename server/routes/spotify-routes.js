const router = require("express").Router();
const passport = require("passport");
var SpotifyWebApi = require('spotify-web-api-node');
const { spotify } = require("../config/keys");
const keys = require("../config/keys");
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";

// when login is successful, retrieve user info
router.get("/success", async(req, res) => {
  if (req.user && req.user.spotify) {
    res.json({
      success: true,
      message: "user has successfully authenticated"
    });
  } else {
    res.status(201).json({
      message: "Not authenticated"
    })
  }
});

router.get("/data", async(req, res) => {
  if (req.user && req.user.spotify) {
    var spotifyApi = new SpotifyWebApi()
    spotifyApi.setAccessToken(req.user.spotify.token)

    let topTracks = []
    let topArtists = []

    spotifyApi.getMyTopArtists()
    .then(function(data) {
      topArtists = data.body.items;
      return spotifyApi.getMySavedShows()
    }, function(err) {
      console.log('Something went wrong!', err);
      res.status(201).json({
        message: "Not authenticated"
      })
    })
    .then(function(data) {
      topTracks = data.body.items;
      res.json({ 
        success: true,
        message: "user has successfully authenticated",
        data: "",
        // cookies: req.cookies
      });
    }, function(err) {
      console.log('Something went wrong!', err);
      res.status(201).json({
        message: "Not authenticated"
      })
    })

  } else {
    res.status(201).json({
      message: "Not authenticated"
    })
  }
});

// when login failed, send failed msg
router.get("/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

// When logout, redirect to client
router.get("/logout", (req, res) => {
  delete req._passport.session.user.spotify;
  res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with passport
router.get("", passport.authenticate("spotify", {
  scope: ["user-top-read", "user-library-read", "user-read-playback-position"]
}));

// redirect to home page after successfully login via spotify
router.get("/redirect",
  passport.authenticate("spotify", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/spotify/failed"
  })
);

module.exports = router;