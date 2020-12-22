const router = require("express").Router();
const passport = require("passport");
const keys = require("../config/keys");
const CLIENT_HOME_PAGE_URL = keys.sites.client;
const Strava = require('strava-v3');
const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs');
const superagent = require('superagent');
const { promisify } = require('util')
const request = require("request")
const csv=require('csvtojson')

const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)

// when login is successful, retrieve user info
router.get("/success", async(req, res) => {
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
router.get("/data", async (req, res) => {
  if (req.user && req.user.strava) {

    Strava.config({
      // "access_token"  : keys.strava.access_token,
      "client_id"     : keys.strava.clientID,
      "client_secret" : keys.strava.clientSecret,
      "redirect_uri"  : 'auth/strava/redirect',
    });

    var prs = {
      "1k" : {
        "time" : 0.0
      },
      "1 mile" : {
        "time" : 0.0
      },
      "5k" : {
        "time" : 0.0
      },
      "10k" : {
        "time" : 0.0
      },
      "Half-Marathon" : {
        "time" : 0.0
      },
      "Marathon" : {
        "time" : 0.0
      }
    }

    var photos = []

    var maxKudos = {
      kudos: 0
    }

    var loop = true
    var page = 1

    var activities = {}

    // const athlete = await Strava.athlete.get({'access_token':req.user.strava.token});
    const athlete = {
      firstname: "Joshua",
      lastname: "McMillan"
    }
    
    // var distance = 0
    // var time = 0
    // var runs = 0
    // var gain = 0
    while (loop) {
        // const payload = await Strava.athlete.listActivities({'access_token':req.user.strava.token, page: page});
        const file = './data/strava/'+athlete.firstname+'.'+athlete.lastname+'.listActivities.page'+page+'.csv'
        const payload =await csv({checkType: true}).fromFile(file);

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

            // const activ = await Strava.activities.get({'access_token':req.user.strava.token, 'id':activity.id});
            const activarray = await csv({checkType: true}).fromFile('./data/strava/'+athlete.firstname+'.'+athlete.lastname+'.activitypr.'+activity.id+'.csv')
            const activ = activarray[0];
            
            if (activ.photos.count > 0) {
              request(activ.photos.primary.urls["600"]).pipe(fs.createWriteStream('images/photo'+activ.id+'.jpg'));

              photos.push({
                ...activ.photos,
                activity_id: activ.id,
                kudos_count: activ.kudos_count,
                url: keys.sites.server + '/images/photo'+activ.id+'.jpg'
              })
            }
            if (activ.best_efforts) {
              for (const effort of activ.best_efforts) {
                if (effort.pr_rank == 1 && prs[effort.name] && prs[effort.name].time == 0) {
                  prs[effort.name] = {
                    "time": effort.elapsed_time,
                    "date": effort.start_date_local
                  }
                }
              }
            }

            if (activity.kudos_count > maxKudos.kudos && activity.map.summary_polyline) {
              maxKudos = {
                kudos: activity.kudos_count,
                comments: activity.comment_count,
                id: activity.id
              }
            }
        }
    }


    // if (activity.start_date_local.slice(0,10) === "2020-11-13") {
      // const activ = await Strava.activities.get({'access_token':req.user.strava.token, 'id':maxKudos.id});
      const activarray = await csv({checkType: true}).fromFile('./data/strava/'+athlete.firstname+'.'+athlete.lastname+'.activitypr.'+maxKudos.id+'.csv')
      const activ = activarray[0]

      const fetch = require('node-fetch');
      var HTMLParser = require('node-html-parser');
      var promise = await fetch("https://www.strava.com/activities/"+maxKudos.id+"/embed/"+activ.embed_token, {
        method: "GET"
      });
      let html = await promise.text()
      var root = HTMLParser.parse(html)
      const img = root.querySelector('.activity-map img')

      let imgRes = await superagent
      .get(img.rawAttributes.src)
      .set("Content-Type", "application/json")
      .set("accept", "application/octet-stream")
      .buffer(true).disableTLSCerts()
      
      await writeFileAsync('images/'+maxKudos.id+'.png',imgRes.body)
      maxKudos.img = keys.sites.server + '/images/'+maxKudos.id+'.png'
      maxKudos.name = activ.name
    // }

    res.json({
      success: true,
      message: "user has successfully authenticated",
      data: {
        ...req.user.strava,
        activities: activities,
        maxKudos: maxKudos,
        prs: prs,
        photos: photos
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
router.get("/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

// When logout, redirect to client
router.get("/logout", (req, res) => {
  delete req._passport.session.user.strava;
  res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with passport
router.get("", passport.authenticate("strava", {
  scope: ["activity:read_all"]
}));

// redirect to home page after successfully login via strava
router.get("/redirect",
  passport.authenticate("strava", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/strava/failed"
  })
);

// const getImgFromOctet = (source) => new Promise( resolve => {
// })


module.exports = router;