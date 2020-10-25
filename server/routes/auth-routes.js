const router = require("express").Router();
const passport = require("passport");
const Strava = require('strava-v3');
const keys = require("./../config/keys");
const goodreads = require('goodreads-api-node');
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";
const fetch = require('node-fetch');

// when login is successful, retrieve user info
router.get("/strava/success", async(req, res) => {
  if (req.user && req.user.strava) {
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

// when login is successful, retrieve user info
router.get("/strava/data", async (req, res) => {
  if (req.user && req.user.strava) {

    Strava.config({
      // "access_token"  : keys.strava.access_token,
      "client_id"     : keys.strava.clientID,
      "client_secret" : keys.strava.clientSecret,
      "redirect_uri"  : 'auth/strava/redirect',
    });
    var loop = true
    var page = 1

    var activities = {}
    // var distance = 0
    // var time = 0
    // var runs = 0
    // var gain = 0
    while (loop) {
        const payload = await Strava.athlete.listActivities({'access_token':req.user.strava.token, page: page});
        page ++
        for (const activity of payload) {
            if (activity.start_date_local.slice(0,4) === "2020") {
                if (!activities[activity.type]) {
                  activities[activity.type] = {
                    distance: activity.distance,
                    time: activity.moving_time,
                    gain: activity.total_elevation_gain,
                    count: 1
                  }
                } else {
                    activities[activity.type].distance += activity.distance
                    activities[activity.type].time += activity.moving_time
                    activities[activity.type].gain += activity.total_elevation_gain
                    activities[activity.type].count ++
                }
            } else {
                loop = false
                break
            }
        }
    }

    res.json({
      success: true,
      message: "user has successfully authenticated",
      data: {
        ...req.user.strava,
        activities: activities
      }
      // cookies: req.cookies
    });
  } else {
    res.status(201).json({
      message: "Not authenticated"
    })
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
router.get("/applemusic/success", async(req, res) => {
  // if (req.user && req.user.goodreads) {
    res.status(201).json({
      success: true,
      message: "user has successfully authenticated"
    });
  // } else {
  //   res.status(201).json({
  //     message: "Not authenticated"
  //   })
  // }
});

router.get("/applemusic/data", async(req, res) => {
  fetch("https://amp-api.music.apple.com/v1/me/music-summaries/year-2020?views=top-artists%2Ctop-albums%2Ctop-songs&include[music-summaries]=playlist&include[playlists]=tracks&includeOnly=playlist%2Ctracks%2Csong%2Cartist%2Calbum", {
    method: "GET",
    headers: {
      "authorization":"Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IldlYlBsYXlLaWQifQ.eyJpc3MiOiJBTVBXZWJQbGF5IiwiaWF0IjoxNjAxOTQxODc4LCJleHAiOjE2MTc0OTM4Nzh9.WsDseiyIpJa-S6c9IuFP311oYnT9jeYfJiVbyJTP11AQLeMrq0lkhz6Z1joAou2SViN-cjH3NK5Ae6vG1M4RfQ",
      "media-user-token":"AhHShJTpAxPPlg3HaBnisvvy62npeOyTkXpHjITsA+iq+OSnZgKsAeF0vaaEbE0eU3MxdXBxMOg4ePLBQWEF5UN7Nxgvy9H3JOi3NROKK2+N+d20Sr1GekQJnD43NPzmKILbXkkbYPfWTvIpMd4ArKz0RVTOOyMjovpoKngTq0QeoEuMiL8+M9S13xs5JBxEtslSnMuqzdhcs9WPcsryqvYnTOOdACFbeMRN4+G15AnTZmMFIw=="
    }
  })
  .then(res => res.json())
  .then(json => {
    var data = json.data[0]
    data.provider = "applemusic"
    res.json({
      data: data
    })
  });
});

// when login is successful, retrieve user info
router.get("/applepodcasts/success", async(req, res) => {
  // if (req.user && req.user.goodreads) {
    res.status(201).json({
      success: true,
      message: "user has successfully authenticated"
    });
  // } else {
  //   res.status(201).json({
  //     message: "Not authenticated"
  //   })
  // }
});

router.get("/applepodcasts/data", async(req, res) => {
  var genres = {}
  var next = "/v1/me/library/podcasts"
  while (true) {
    var promise = await fetch("https://amp-api.podcasts.apple.com" + next, {
      method: "GET",
      headers: {
        "authorization":"Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IldlYlBsYXlLaWQifQ.eyJpc3MiOiJBTVBXZWJQbGF5IiwiaWF0IjoxNjAxOTQxODc4LCJleHAiOjE2MTc0OTM4Nzh9.WsDseiyIpJa-S6c9IuFP311oYnT9jeYfJiVbyJTP11AQLeMrq0lkhz6Z1joAou2SViN-cjH3NK5Ae6vG1M4RfQ",
        "media-user-token":"AhHShJTpAxPPlg3HaBnisvvy62npeOyTkXpHjITsA+iq+OSnZgKsAeF0vaaEbE0eU3MxdXBxMOg4ePLBQWEF5UN7Nxgvy9H3JOi3NROKK2+N+d20Sr1GekQJnD43NPzmKILbXkkbYPfWTvIpMd4ArKz0RVTOOyMjovpoKngTq0QeoEuMiL8+M9S13xs5JBxEtslSnMuqzdhcs9WPcsryqvYnTOOdACFbeMRN4+G15AnTZmMFIw=="
      }
    });
    let data = await promise.json()
    for (const podcast of data.data) {
      for (const genreName of podcast.attributes.genreNames) {
        if (genres[genreName]) {
          genres[genreName] ++
        } else {
          genres[genreName] = 1
        }
      }
    }
    if (data.next) {
      next = data.next
    } else {
      break;
    }
  }
  var data = {
    genres: genres,
    provider: "applepodcasts"
  }
  res.json({
    data: data
  })
});

// when login is successful, retrieve user info
router.get("/goodreads/success", async(req, res) => {
  if (req.user && req.user.goodreads) {
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

router.get("/goodreads/data", async(req, res) => {
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
      var promise = await gr.getBooksOnUserShelf(req.user.goodreads.id, "read", {sort:"date_read", v:"2"})
  
      var books = []
      var imgs = []
      var audiobooks = 0
      var pages = 0
      for (const review of promise.reviews.review) {
    
        if ((review.date_added && review.date_added.slice(review.date_added.length - 4,review.date_added.length) == 2020) || (review.read_at && review.read_at.slice(review.read_at.length - 4,review.read_at.length) == 2020))  {
          if (review.read_count > 0) {
            books.push(review.book.title)
            if(review.book.large_image_url) {
              imgs.push(review.book.large_image_url)
            } else {
              imgs.push(review.book.image_url)
            }
            if (review.book.format == "Audiobook") {
              audiobooks += 1
            } else if (review.book.num_pages) {
              pages += parseInt(review.book.num_pages)
            } else {
          
            }
          }
        } else {
          break;
        }
        // var bookPromise = await gr.showBook(book.id);
        
      }
    } catch(e) {
      console.error(e);
    }

    var data = {
      ...req.user.goodreads
    }
    data.books = books
    data.audiobooks = audiobooks
    data.pages = pages
    data.imgs = imgs

    res.json({
      success: true,
      message: "user has successfully authenticated",
      data: data,
      // cookies: req.cookies
    });
  } else {
    res.status(201).json({
      message: "Not authenticated"
    })
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

// auth with youversion
router.post("/youversion", passport.authenticate('local', {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/goodreads/failed"
  })
);

// When you visit http://localhost:3000/login, you will see "Login Page"
router.get('/youversion', (req, res, next) => {
  const form = '<h1>Login Page</h1><form method="POST" action="/auth/youversion">\
  Enter Username:<br><input type="text" name="username">\
  <br>Enter Password:<br><input type="password" name="password">\
  <br><br><input type="submit" value="Submit"></form>';
  res.send(form);
});

router.get("/youversion/success", async(req, res) => {
  if (req.user && req.user.youversion) {
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

router.get("/youversion/data", async(req, res) => {
  const headers = {
    "accept":"application/json",
    "accept-language":"en",
    "referer":"https://my.bible.com/",
    "x-youversion-app-platform":"web",
    "x-youversion-app-version":"4",
    "x-youversion-client":"youversion"
  }

  if (req.user && req.user.youversion) {
    var longestPlan = {
      total_days: 0
    }
    var plans = []

    // while (true) {
      var promise = await fetch("https://plans.youversionapi.com/4.0/subscriptions?order=desc&page=1&status=completed", {
        method: "GET",
        headers: {
          ...headers,
          "authorization":"Bearer " + req.user.youversion.access_token,
        }
      });
      let plansData = await promise.json()
      
      for (const plan of plansData.data) {
        if (plan.completed_dt.slice(0,4) == "2020") {
          var planPromise = await fetch("https://nodejs.bible.com/api_auth/reading-plans/view/3.1?id="+plan.plan_id+"&language_tag=en", {
            method: "GET",
            headers: {
              ...headers,
              "authorization":"Bearer " + req.user.youversion.youversion_token,
            }
          });
          let planDetails = await planPromise.json()
          plans.push(planDetails)
          if (planDetails.total_days > longestPlan.total_days) {
            longestPlan = planDetails
          }
      
        }
      }
    // }
    var data = {
      ...req.user.youversion
    }
    data.plans = plans
    data.longestPlan = longestPlan
    
    res.json({
      success: true,
      message: "user has successfully authenticated",
      data: data,
      // cookies: req.cookies
    });
  } else {
    res.status(201).json({
      message: "Not authenticated"
    })
  }
});

module.exports = router;
