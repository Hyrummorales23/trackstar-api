const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// Determine callback URL based on environment
const getCallbackURL = () => {
  if (process.env.NODE_ENV === "production") {
    return (
      process.env.GOOGLE_CALLBACK_URL ||
      "https://trackstar-api.onrender.com/auth/google/callback"
    );
  } else {
    return (
      process.env.GOOGLE_CALLBACK_URL_LOCAL ||
      "http://localhost:3000/auth/google/callback"
    );
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: getCallbackURL(),
      proxy: true, // Important for production
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google OAuth profile received:", profile.id);

        // Check if user already exists
        let user = await User.findOne({
          oauthId: profile.id,
          provider: "google",
        });

        if (user) {
          console.log("Existing user found:", user.email);
          return done(null, user);
        }

        // Create new user
        user = new User({
          oauthId: profile.id,
          provider: "google",
          name: profile.displayName,
          email: profile.emails[0].value,
          username: profile.emails[0].value.split("@")[0],
          avatar: profile.photos[0].value,
        });

        await user.save();
        console.log("New user created:", user.email);
        return done(null, user);
      } catch (error) {
        console.error("OAuth error:", error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
