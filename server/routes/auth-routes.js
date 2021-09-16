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
  fetch("https://amp-api.music.apple.com/v1/me/music-summaries/year-2021?views=top-artists%2Ctop-albums%2Ctop-songs&include[music-summaries]=playlist&include[playlists]=tracks&includeOnly=playlist%2Ctracks%2Csong%2Cartist%2Calbum", {
    method: "GET",
    headers: {
      "authorization":"Bearer [xxxxxx]",
      "media-user-token":"[xxxxxx]"
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

// // when login is successful, retrieve user info
// router.get("/applepodcasts/success", async(req, res) => {
//   // if (req.user && req.user.goodreads) {
//     res.status(201).json({
//       success: true,
//       message: "user has successfully authenticated"
//     });
//   // } else {
//   //   res.status(201).json({
//   //     message: "Not authenticated"
//   //   })
//   // }
// });

// router.get("/applepodcasts/data", async(req, res) => {
//   var genres = {}
//   var next = "/v1/me/library/podcasts"
//   while (true) {
//     var promise = await fetch("https://amp-api.podcasts.apple.com" + next, {
//       method: "GET",
//       headers: {
//         "authorization":"Bearer [xxxxxx]",
//         "media-user-token":"[xxxxxx]"
//       }
//     });
//     let data = await promise.json()
//     for (const podcast of data.data) {
//       for (const genreName of podcast.attributes.genreNames) {
//         if (genres[genreName]) {
//           genres[genreName] ++
//         } else {
//           genres[genreName] = 1
//         }
//       }
//     }
//     if (data.next) {
//       next = data.next
//     } else {
//       break;
//     }
//   }
//   var data = {
//     genres: genres,
//     provider: "applepodcasts"
//   }
//   res.json({
//     data: data
//   })
// });

module.exports = router;