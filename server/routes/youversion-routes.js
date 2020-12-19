const router = require("express").Router();
const passport = require("passport");
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";
const fetch = require('node-fetch');
var path = require('path');

// auth with youversion
router.post("", passport.authenticate('local', {
  successRedirect: CLIENT_HOME_PAGE_URL,
  failureRedirect: "/auth/youversion/failed"
})
);

// When you visit http://localhost:3000/login, you will see "Login Page"
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