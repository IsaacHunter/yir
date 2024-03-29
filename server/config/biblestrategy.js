/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The Youversion authentication strategy authenticates requests by delegating to
 * Youversion using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Youversion application's client id
 *   - `clientSecret`  your Youversion application's client secret
 *   - `callbackURL`   URL to which Youversion will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new YouversionStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/youversion/callback'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://nodejs.bible.com/oauth/';
  options.tokenURL = options.tokenURL || 'https://nodejs.bible.com/oauth/token';
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'youversion';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from Youversion.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `youversion`
 *   - `id`
 *   - `username`
 *   - `displayName`
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get('https://www.youversion.com/api/v3/athlete', accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try {
      var json = JSON.parse(body);
      
      var profile = { provider: 'youversion' };
      if (json.id) {
		  //correct youversion format athlete
        profile.id = json.id;
        profile.displayName = json.firstname + ' ' + json.lastname;
		profile.name = { familyName : json.lastname, givenName : json.firstname};
		profile.photos = [{ value : json.profile }, { value : json.profile_medium }]
        profile.emails = [{ value: json.email }];
		
		profile.token = accessToken;
      }
      
      profile._raw = body;
      profile._json = json;
      
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
