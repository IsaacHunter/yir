const router = require("express").Router();
const passport = require("passport");
const keys = require("./../config/keys");
const goodreads = require('goodreads-api-node');
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";

// when login is successful, retrieve user info
router.get("/strava/success", (req, res) => {
  if (req.user && req.user.strava) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      strava: {
        user: req.user.strava
      },
      cookies: req.cookies
    });
  }
});

// when login failed, send failed msg
router.get("/strava/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

// When logout, redirect to client
router.get("/strava/logout", (req, res) => {
  delete req._passport.session.user.strava;
  res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with passport
router.get("/strava", passport.authenticate("strava", {
  scope: ["activity:read_all"]
}));

// redirect to home page after successfully login via strava
router.get(
  "/strava/redirect",
  passport.authenticate("strava", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/strava/failed"
  })
);



// when login is successful, retrieve user info
router.get("/goodreads/success", async(req, res) => {
  if (req.user && req.user.goodreads) {
    const myCredentials = {
      key: keys.goodreads.consumerKey, //req.user.token,
      secret: keys.goodreads.consumerSecret, 
    };
    const token = {
      OAUTH_TOKEN: req.user.goodreads.token,
      OAUTH_TOKEN_SECRET: req.user.goodreads.tokenSecret,
    }
    
    var readId
    const gr = goodreads(myCredentials);
    gr.initOAuth();
    gr._setOAuthToken(token);
    try {
      var promise = await gr.getBooksOnUserShelf(req.user.goodreads.id, "read", {sort:"date_read"})
      console.log(promise)
      var books = 0
      var audiobooks = 0
      var pages = 0
      for (const review of promise.reviews.review) {
        console.log(review)
        if ((review.date_added && review.date_added.slice(review.date_added.length - 4,review.date_added.length) == 2020) || (review.read_at && review.read_at.slice(review.read_at.length - 4,review.read_at.length) == 2020))  {
          if (review.read_count > 0) {
            books += 1
            if (review.book.format == "Audiobook") {
              audiobooks += 1
            } else if (review.book.num_pages) {
              pages += parseInt(review.book.num_pages)
            } else {
              console.log("NO PAGES")
            }
          }
        } else {
          break;
        }
        // var bookPromise = await gr.showBook(book.id);
        // console.log(bookPromise);
      }
    } catch(e) {
      console.error(e);
    }

    res.json({
      success: true,
      message: "user has successfully authenticated",
      goodreads: {
        user: req.user.goodreads,
        books: books,
        audiobooks: audiobooks,
        pages: pages
      },
      cookies: req.cookies
    });
  }
});

// when login failed, send failed msg
router.get("/goodreads/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

// When logout, redirect to client
router.get("/goodreads/logout", (req, res) => {
  delete req._passport.session.user.goodreads;
  res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with passport
router.get("/goodreads", passport.authenticate("goodreads", {
  scope: ["activity:read_all"]
}));

// redirect to home page after successfully login via goodreads
router.get(
  "/goodreads/redirect",
  passport.authenticate("goodreads", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/goodreads/failed"
  })
);

module.exports = router;
