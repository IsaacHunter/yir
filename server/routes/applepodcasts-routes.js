const router = require("express").Router();
const passport = require("passport");
const keys = require("../config/keys");
const CLIENT_HOME_PAGE_URL = keys.sites.client;
var path = require('path');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
const sqlite3 = require('sqlite3')
const { open } = require('sqlite');
const request = require("request");
const fs = require('fs');

// auth with applepodcasts
router.post("", upload.single('podcast-file'), function (req, res, next) {
  return passport.authenticate('applepodcasts', {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/strava/failed"
  })(req, res, next);
});

// Login Page
router.get("", function (req, res, next) {
  res.sendFile(path.join(__dirname + '/applepodcasts-login.html'));
});

router.get("/success", async(req, res) => {
  if (req.user && req.user.applepodcasts) {
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
  if (req.user && req.user.applepodcasts) {
    let db = await open({
      filename: "./uploads/" + req.user.applepodcasts.filename,
      driver: sqlite3.Database
    });

    // let db = new sqlite3.Database, (err) => {
    //   if (err) {
    //     console.log('Could not connect to database', err)
    //   } else {
    //     console.log('Connected to database')
    //   }
    // })
    var pods = {}
    var topPods = []
    var podStats = {duration: 0}
    var bingeDays = {}
    var maxBingeDay = {duration: 0}
    const results = await db.all(`SELECT ZCLEANEDTITLE as title,
              ZPODCASTUUID as id,
              ZLASTDATEPLAYED as lastDatePlayed,
              ZPLAYHEAD as playhead,
              ZDURATION as duration
              FROM ZMTEPISODE
              WHERE ZPLAYSTATEMANUALLYSET = 0 AND
              ZLASTDATEPLAYED > 631065600
              ORDER BY ZLASTDATEPLAYED DESC`)
    
    podStats.count = results.length
    for (var pod of results) {
      if (pod.lastDatePlayed > 631065600) {
        if (!pods[pod.id]) {
          pods[pod.id] = {
            duration: 0,
            count: 0
          }
        }
        var day = Math.floor(pod.lastDatePlayed / 86400)
        if (!bingeDays[day]) {
          bingeDays[day] = 0
        }
        pods[pod.id].count ++
        var duration = pod.playhead
        if (pod.playhead == 0) {
          duration = pod.duration
        }
        podStats.duration += duration
        pods[pod.id].duration += duration
        bingeDays[day] += duration
        if (bingeDays[day] > maxBingeDay.duration) {
          maxBingeDay = {
            day: day,
            duration: bingeDays[day]
          }
        }

      } else {
        break;
      }
    }
    var ids = Object.keys(pods).sort(function( a, b ) {
      return pods[b].duration - pods[a].duration;
    })

    var bingeDay = new Date(2001, 0, 1)
    bingeDay.setDate(bingeDay.getDate() + maxBingeDay.day);
    maxBingeDay.date = bingeDay
    podStats.binge = maxBingeDay
    podStats.shows = ids.length
    for (var i = 0; i < 5; i++) {
      const result = await db.get(`SELECT ZTITLE as title,
        ZIMAGEURL as imgUrl
        FROM ZMTPODCAST
        WHERE ZUUID = ?`, ids[i])

      var newUrl = 'images/podcast'+ids[i]+result.imgUrl.substr(result.imgUrl.length-4, 4)
      request(result.imgUrl).pipe(fs.createWriteStream(newUrl));
      result.duration = pods[ids[i]].duration
      result.count = pods[ids[i]].count
      result.url = keys.sites.server + '/' + newUrl
      topPods.push(result)
    }

    var data = {
      ...req.user.applepodcasts,
      topPods: topPods,
      podStats: podStats
    }

    res.json({
      success: true,
      message: "user has successfully authenticated",
      data: data
      // cookies: req.cookies
    });
  } else {
    res.status(201).json({
      message: "Not authenticated"
    })
  }
});

module.exports = router;