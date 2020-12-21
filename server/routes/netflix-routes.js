const router = require("express").Router();
const passport = require("passport");
const Netflix = require('netflix2')
const keys = require("../config/keys");
const CLIENT_HOME_PAGE_URL = keys.sites.client;
const util = require('util');

// Promisify the netflix2 API so that it doesn't follow the
// (error, [...],  callback) => void scheme but instead looks
// like (...) => Promise
Netflix.prototype.login = util.promisify(Netflix.prototype.login);
Netflix.prototype.getProfiles = util.promisify(Netflix.prototype.getProfiles);
Netflix.prototype.switchProfile = util.promisify(Netflix.prototype.switchProfile);
Netflix.prototype.getRatingHistory = util.promisify(Netflix.prototype.getRatingHistory);
Netflix.prototype.getViewingHistory = util.promisify(Netflix.prototype.getViewingHistory);
Netflix.prototype.setStarRating = util.promisify(Netflix.prototype.setStarRating);
Netflix.prototype.setThumbRating = util.promisify(Netflix.prototype.setThumbRating);
const sleep = util.promisify(setTimeout);


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

function callback (error, result) {
  if(error){
    console.error(error);
  }
}

// auth with passport
router.get("", async(req, res) => {
  var netflix = new Netflix()
  // await netflix.login(keys.netflix)
  // const profileGuid = await getProfileGuid(netflix, "Is &amp; Ky")
  // await switchProfile(netflix, profileGuid)
	// try {
    // const results = await netflix.getViewingHistory();
    
  //   const fs = require('fs');

  //   fs.writeFile('netflixs.json', JSON.stringify(results), (err) => {
  //     // throws an error, you could also catch it here
  //     if (err) throw err;
  
  //     // success case, the file was saved
  //     console.log('Lyric saved!');
  // });
  // } catch (e) {
	// 	console.error(e);
	// 	throw new Error('Could not switch profiles. For more information, please see previous log statements.');
  // }
  
  var results = require('../config/netflix.json'); //(with path)
  var series = {}
  var topSeries = []
  var day = results[0].dateStr
  var daySeries = {}
  var biggestBinge = []
  var month = results[0].dateStr.slice(0,7)
  var monthSeries = {}
  var biggestBingeM = []
  

  for (result of results) {
    if (result.seriesTitle) {

      if (result.dateStr != day) {
        var max = ""
        for (siri in daySeries) {
          if (max === "" || daySeries[siri] > daySeries[max]) {
            max = siri
          }
        }
        biggestBinge.push({
          day: day,
          series: max,
          length: daySeries[max]
        })
        day = result.dateStr
        daySeries = {}
      }

      if (result.dateStr.slice(0,7) != month) {
        var max = ""
        for (siri in monthSeries) {
          if (max === "" || monthSeries[siri] > monthSeries[max]) {
            max = siri
          }
        }
        biggestBingeM.push({
          month: month,
          series: max,
          length: monthSeries[max]
        })
        month = result.dateStr.slice(0,7)
        monthSeries = {}
      }

      if (result.dateStr.slice(0,4) != "2020") {
        break;
      }
      if (!series[result.seriesTitle]) {
        series[result.seriesTitle] = 0
      }
      series[result.seriesTitle] += result.bookmark

      if (!daySeries[result.seriesTitle]) {
        daySeries[result.seriesTitle] = 0
      }
      daySeries[result.seriesTitle] += result.bookmark

      if (!monthSeries[result.seriesTitle]) {
        monthSeries[result.seriesTitle] = 0
      }
      monthSeries[result.seriesTitle] += result.bookmark
    }
  }
  
  for (siri in series) {
    var i = 0
    for (topSiri of topSeries) {
      if (series[siri] > series[topSiri]) {
        break;
      }
      i++
    }
    topSeries.splice(i, 0, siri)
  }

  biggestBinge.sort(function(a,b) {
    return b.length - a.length
  });

  biggestBingeM.sort(function(a,b) {
    return b.length - a.length
  });

  console.log(topSeries)
});

// redirect to home page after successfully login via spotify
router.get("/redirect",
  passport.authenticate("spotify", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/spotify/failed"
  })
);

/**
 * Gets profile guid from profile name
 * @param {Netflix} netflix
 * @param {String} profileName
 * @returns {Promise} Promise that is resolved with guid once fetched
 */
getProfileGuid = async function(netflix, profileName) {
	let profiles;
	
	try {
		profiles = await netflix.getProfiles();
	} catch (e) {
		console.error(e);
		throw new Error('Profile GUID could not be determined. For more information, please see previous log' +
							'statements.');
	}
	
	const profileWithCorrectName = profiles.find(profile => profile.firstName === profileName);
	
	if (profileWithCorrectName === undefined) {
		throw new Error(`No profile with name "${profileName}"`);
	} else {
		return profileWithCorrectName.guid;
	}
};

/**
 * Switches to profile specified by guid
 * @param {Netflix} netflix
 * @param {*} guid
 * @returns {Promise} Promise that is resolved once profile is switched
 */
switchProfile = async function(netflix, guid) {
	try {
		const result = await netflix.switchProfile(guid);
		console.log('Successfully switched profile!');
		return result;
	} catch (e) {
		console.error(e);
		throw new Error('Could not switch profiles. For more information, please see previous log statements.');
	}
};

module.exports = router;