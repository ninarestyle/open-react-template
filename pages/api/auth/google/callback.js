// pages/api/auth/google/callback.js
import passport from '@/lib/passport';

export default function handler(req, res) {
  passport.authenticate(
    'google',
    { session: false, failureRedirect: '/login' },
    (err, user) => {
      if (err || !user) {
        console.error('Error during Google authentication:', err);
        return res.status(401).json({ error: 'Authentication failed. Please try again.' });
      }

      // Extract tokens and user information
      const accessToken = user?.accessToken || '';
      const idToken = user?.idToken || '';
      const profileURL = user?.photos?.[0]?.value || '';

      if (!idToken) {
        console.error('ID token is missing. Cannot proceed without it.');
        return res.status(401).json({ error: 'Authentication failed. Missing ID token.' });
      }

      // Redirect to the front-end success page with query params
      res.redirect(
        `/auth/success?accessToken=${encodeURIComponent(accessToken)}&idToken=${encodeURIComponent(idToken)}&profileURL=${encodeURIComponent(profileURL)}`
      );
    }
  )(req, res);
}
