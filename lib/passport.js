// lib/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
      passReqToCallback: false, // Set to false since req is not needed
    },
    (accessToken, refreshToken, params, profile, done) => {
      try {
        // Ensure profile is defined before attaching values
        if (profile) {
          profile.accessToken = accessToken;
          profile.refreshToken = refreshToken;

          // Extract the id_token from params, if available
          if (params && params.id_token) {
            profile.idToken = params.id_token;
          } else {
            console.error('ID token is not available in the parameters from Google');
          }
        } else {
          console.error('Profile is not defined');
        }

        return done(null, profile);
      } catch (error) {
        console.error('Error in Google strategy callback:', error);
        return done(error);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

export default passport;
