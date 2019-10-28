const passport = require("passport");
const User = require("../models/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");

passport.serializeUser(User.serializeUser()); //user.serial is from passport-local-mongoose
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

var options = {
  secretOrKey: "thisisasupersecretkey",
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

passport.use(
  new JwtStrategy(options, (jwt_payload, done) => {
    //jwt_pay is the extracted json
    console.log("payload", jwt_payload);
    User.findById(jwt_payload._id, (err, user) => {
      if (err) return done(err, false);
      if (user) return done(null, user);
      else return done(null, false);
    });
  })
);

module.exports = {
  getToken: user => jwt.sign(user, options.secretOrKey, { expiresIn: 3600 })
};
