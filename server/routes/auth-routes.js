const router = require("express").Router();
const fetch = require('node-fetch');

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

module.exports = router;