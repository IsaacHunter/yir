const cookieSession = require("cookie-session");
const express = require("express");
const app = express();
const port = 4000;
const passport = require("passport");
const passportSetup = require("./config/passport-setup");
const session = require("express-session");

const authRoutes = require("./routes/auth-routes");
const stravaRoutes = require("./routes/strava-routes");
const goodreadsRoutes = require("./routes/goodreads-routes");
const youversionRoutes = require("./routes/youversion-routes");
const spotifyRoutes = require("./routes/spotify-routes");
const netflixRoutes = require("./routes/netflix-routes");

// const mongoose = require("mongoose");
const keys = require("./config/keys");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // parse cookie header
const bodyParser = require("body-parser");

// connect to mongodb
// mongoose.connect(keys.MONGODB_URI, () => {
//   console.log("connected to mongo db");
// });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  cookieSession({
    name: "session",
    keys: [keys.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100
  })
);

// parse cookies
app.use(cookieParser());

// initalize passport
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());

// set up cors to allow us to accept requests from our client
app.use(
  cors({
    origin: keys.sites.client, // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);

app.use('/images', express.static('images'))
// set up routes
app.use("/auth", authRoutes);
app.use("/auth/strava", stravaRoutes);
app.use("/auth/goodreads", goodreadsRoutes);
app.use("/auth/youversion", youversionRoutes);
app.use("/auth/spotify", spotifyRoutes);
app.use("/auth/netflix", netflixRoutes);

// connect react to nodejs express server
app.listen(port, () => console.log(`Server is running on port ${port}!`));
