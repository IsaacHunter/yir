const router = require("express").Router();
const passport = require("passport");
const keys = require("../config/keys");
const CLIENT_HOME_PAGE_URL = keys.sites.client;
const fetch = require('node-fetch');
const versecount = require('./youversion-versecount.json')
var path = require('path');

// auth with youversion
router.post("", passport.authenticate('local', {
  successRedirect: CLIENT_HOME_PAGE_URL,
  failureRedirect: "/auth/youversion/failed"
})
);

// Login Page
router.get('', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/youversion-login.html'));
});

router.get("/success", async(req, res) => {
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

router.get("/data", async(req, res) => {
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
  var photos = []

  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = now - start;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  var streakPromise = await fetch("https://nodejs.bible.com/api/streaks/checkin/3.2", {
    method: "POST",
    headers: {
      ...headers,
      "content-type":"application/json",
      "authorization":"Bearer " + req.user.youversion.youversion_token,
    },
    body: JSON.stringify({
      user_id:23224621,
      day_of_year:day,
      year:now.getFullYear()
    })
  });
  let streakData = await streakPromise.json()
  var numVerses = 0

  var nextPage = true
  var page = 1
  while (nextPage) {
    var promise = await fetch("https://plans.youversionapi.com/4.0/subscriptions?order=desc&page=1&status=completed&page="+page, {
      method: "GET",
      headers: {
        ...headers,
        "authorization":"Bearer " + req.user.youversion.access_token,
      }
    });
    let plansData = await promise.json()
    page++
    nextPage = plansData.next_page
    
    for (const plan of plansData.data) {
      if (plan.completed_dt.slice(0,4) == "2021") {
        var planPromise = await fetch("https://nodejs.bible.com/api_auth/reading-plans/view/3.1?id="+plan.plan_id+"&language_tag=en", {
          method: "GET",
          headers: {
            ...headers,
            "authorization":"Bearer " + req.user.youversion.youversion_token,
          }
        });

        let planDetails = await planPromise.json()

        var bestImgHeight = 0
        var bestImg
        for (var img of planDetails.images) {
          if (img.height == img.width && img.height > bestImgHeight) {
            bestImgHeight = img.height
            bestImg = img.url
            if (bestImg.slice(0,31) === "//imageproxy.youversionapi.com/") {
              bestImg = "http:" + bestImg
            }
          }
        }
        photos.push(bestImg)
        plans.push(planDetails)

        if (planDetails.total_days > longestPlan.total_days) {
          longestPlan = {
            ...planDetails,
            together_id: plan.together_id,
            completed_dt: plan.completed_dt,
            best_img: bestImg
          }
        }    
      }
    }
  }

  var planNextPage = true
  var planPage = 1
  while (planNextPage) {
    var together = (longestPlan.together_id ? "true" : "false")
    var promiseDays = await fetch("https://plans.youversionapi.com/4.0/plans/"+longestPlan.id+"/days?together="+together+"&page="+planPage, {
      method: "GET",
      headers: {
        ...headers,
        "authorization":"Bearer " + req.user.youversion.access_token,
      }
    });
    let planDays = await promiseDays.json()
    planPage++
    planNextPage = planDays.next_page
    for (var planDay of planDays.data) {
      for (var segment of planDay.segments) {
        if (segment.kind == "reference") {
          for (var content of segment.content) {
            var eachCont = content.split("+")
            for (var each of eachCont) {
              var numPeriods = each.split(".").length
              if (numPeriods == 3) {
                numVerses ++
              } else if (numPeriods == 2) {
                numVerses += versecount[each]
              }
            }
          }
        }
      }
    }
  }
  longestPlan.num_verses = numVerses
  streakData.plans = plans.length

  var data = {
    ...req.user.youversion,
    photos: photos,
    longestPlan: longestPlan,
    streakData: streakData
  }
  
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