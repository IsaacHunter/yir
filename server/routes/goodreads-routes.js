const router = require("express").Router();
const passport = require("passport");
const keys = require("../config/keys");
const CLIENT_HOME_PAGE_URL = keys.sites.client;
const goodreads = require('../goodreads-api-node');
const request = require("request")
const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');
const csv=require('csvtojson')
const myCredentials = {
  key: keys.goodreads.consumerKey, //req.user.token,
  secret: keys.goodreads.consumerSecret, 
};
const gr = goodreads(myCredentials);

// when login is successful, retrieve user info
router.get("/success", async(req, res) => {
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

router.get("/data", async(req, res) => {
  if (req.user && req.user.goodreads) {
    const myCredentials = {
      key: keys.goodreads.consumerKey, //req.user.token,
      secret: keys.goodreads.consumerSecret, 
    };
    const token = {
      OAUTH_TOKEN: req.user.goodreads.token,
      OAUTH_TOKEN_SECRET: req.user.goodreads.tokenSecret,
    }
    
    const gr = goodreads(myCredentials);
    gr.initOAuth();
    gr._setOAuthToken(token);

    req.user.goodreads.id = "127385526"
    try {
      var bookList = {
        longest: {
          count: 0
        },
        shortest: {
          count: 1000
        },
        popular: {
          count: 0
        },
        unpopular: {
          count: 100000
        },
        rating: {
          count: 0
        }
      }
      var books = []
      var imgs = []
      var audiobooks = 0
      var pages = 0
      var feedback = ""
      var authors = {}
      var end = 0
      var total = 1
      var page = 1
      while (end < total && page < 3) {
        // var promise = await gr.getBooksOnUserShelf(req.user.goodreads.id, "read", {sort:"date_read", v:"2", page:page.toString()})

        // var csv = new ObjectsToCsv(promise.reviews.review);
        // await csv.toDisk('./data/goodreads/'+req.user.goodreads.id+'.readbooks.page'+page.toString()+'.csv');
        var review = await csv({checkType: true}).fromFile('./data/goodreads/'+req.user.goodreads.id+'.readbooks.page'+page.toString()+'.csv')
        var promise = {
          reviews: {
            review: review,
            end: 0,
            total: 1
          }
        }
        end = parseInt(promise.reviews.end)
        total = parseInt(promise.reviews.total)
        page++
        for (const review of promise.reviews.review) {
          if ((review.read_at && review.read_at.slice(review.read_at.length - 4,review.read_at.length) == 2020) || (review.read_at == "" && review.date_added && review.date_added.slice(review.date_added.length - 4,review.date_added.length) == 2020))  {
            if (review.read_count > 0) {
              books.push(review.book.title)

              var userVersionBook = await csv({checkType: true}).fromFile('./data/goodreads/'+req.user.goodreads.id+'.userVersionBook.'+review.book.id._+'.csv');
              var userVersionPromise = {book: userVersionBook[0]}
              var bestVersionBook = await csv({checkType: true}).fromFile('./data/goodreads/'+req.user.goodreads.id+'.bestVersionBook.'+userVersionPromise.book.work.best_book_id._+'.csv');
              var bestVersionPromise = {book: bestVersionBook[0]}

              // csv = new ObjectsToCsv([userVersionPromise.book]);
              // await csv.toDisk('./data/goodreads/'+req.user.goodreads.id+'.userVersionBook.'+review.book.id._+'.csv');

              // csv = new ObjectsToCsv([bestVersionPromise.book]);
              // await csv.toDisk('./data/goodreads/'+req.user.goodreads.id+'.bestVersionBook.'+userVersionPromise.book.work.best_book_id._+'.csv');

              var img = ""
              if(review.book.large_image_url) {
                img = review.book.large_image_url
              } else if (review.book.image_url.includes("nophoto")) {
                feedback+= "Your book " + review.book.title + " has no cover image on goodreads. "
              } else {
                img  = review.book.image_url
              }
              if (img) {
                imgs.push(img)
                var authorArr
                if (bestVersionPromise.book.authors.author.length) {
                  authorArr = bestVersionPromise.book.authors.author
                } else {
                  authorArr = [bestVersionPromise.book.authors.author]
                }
                for (var author of authorArr) {
                  if (!authors[author.id]) {
                    authors[author.id] = {
                      name: author.name,
                      img: author.image_url._,
                      booksThisYear: [
                        {url: img}
                      ],
                      previousBooks: [],
                      count: 1
                    }
                  } else {
                    authors[author.id].booksThisYear.push({url: img})
                    authors[author.id].count++
                  }
                }
              }

              if (review.book.format == "Audiobook") {
                audiobooks += 1
              }

              var pageCount = 0
              if (bestVersionPromise.book.num_pages) {
                pageCount = parseInt(bestVersionPromise.book.num_pages)
              } else if (review.book.num_pages > 20) {
                pageCount = parseInt(review.book.num_pages)
              } else {
                feedback+= "Your book " + review.book.title + " has no number of pages on goodreads. "
              }

              if (pageCount > 0) {
                pages += pageCount
                if (pageCount > bookList.longest.count && img) {
                  bookList.longest = {
                    count: pageCount,
                    img: img
                  }
                }
                if (pageCount < bookList.shortest.count && img) {
                  bookList.shortest = {
                    count: pageCount,
                    img: img
                  }
                }
              }

              if (bestVersionPromise.book.popular_shelves) {
                var shelved = 0
                for (var shelf of bestVersionPromise.book.popular_shelves.shelf) {
                  shelved += parseInt(shelf.count)
                }
                if (shelved > bookList.popular.count && img) {
                  bookList.popular = {
                    count: shelved,
                    img: img
                  }
                }
                if (shelved < bookList.unpopular.count && img) {
                  bookList.unpopular = {
                    count: shelved,
                    img: img
                  }
                }
              }

              if (parseFloat(bestVersionPromise.book.average_rating) > bookList.rating.count && img) {
                bookList.rating = {
                  count: parseFloat(bestVersionPromise.book.average_rating),
                  img: img
                }
              }

            }
          } else {
            if (review.read_count > 0) {
              if (authors[review.book.authors.author.id]) {
                authors[review.book.authors.author.id].count++
                
                var img = ""
                if(review.book.large_image_url) {
                  img = review.book.large_image_url
                } else if (review.book.image_url.includes("nophoto")) {
                  feedback+= "Your book " + review.book.title + " has no cover image on goodreads. "
                } else {
                  img  = review.book.image_url
                }
                if (img) {
                  authors[review.book.authors.author.id].previousBooks.push({url: img})
                }
              }
            }
          }
          // var bookPromise = await gr.showBook(book.id);
          
        }
      }
    } catch(e) {
      console.error(e);
    }
    if (feedback != "") {
      feedback = feedback + "You might be able to fix it by switching editions. Go to the book's page on Goodreads, click on All Editions and switch to a different edition"
    }

    var favAuthor = {
      count: 1
    }
    for (const id in authors) {
      if (authors[id].count > favAuthor.count) {
        favAuthor = authors[id]
        favAuthor.id = id
      }
    }
    
    request(favAuthor.img.replace('\n','')).pipe(fs.createWriteStream('images/author'+favAuthor.id+'.jpg'));
    favAuthor.img = keys.sites.server + '/images/author'+favAuthor.id+'.jpg'
    
    var data = {
      ...req.user.goodreads
    }
    data.books = books
    data.audiobooks = audiobooks
    data.pages = pages
    data.imgs = imgs
    data.feedback = feedback
    data.bookList = bookList
    if (favAuthor.name) {
      data.author = favAuthor
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

// when login failed, send failed msg
router.get("/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate."
  });
});

// When logout, redirect to client
router.get("/logout", (req, res) => {
  delete req._passport.session.user.goodreads;
  res.redirect(CLIENT_HOME_PAGE_URL);
});

// auth with passport
router.get("", (req, res) => {
  gr.initOAuth(keys.sites.server + "/auth/goodreads/redirect");
  gr.getRequestToken()
  .then(url => {
     res.redirect(200, url)
    });
})

// redirect to home page after successfully login via goodreads
router.get("/redirect", async (req, res, next) => {
  var accessTokens = await gr.getAccessToken()
  var user = await gr.getCurrentUserInfo()
  req.goodreads = {
    ...accessTokens,
    id: user.user.id
  }
  return passport.authenticate('goodreads', {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/auth/goodreads/failed"
  })(req, res, next);
  });

module.exports = router;