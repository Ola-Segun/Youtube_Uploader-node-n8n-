const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { oauth2Client, revokeToken } = require('../services/oauthService');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ where: { googleId: profile.id } });
    if (!user) {
      user = await User.create({
        email: profile.emails[0].value,
        googleId: profile.id,
        accessToken,
        refreshToken
      });
    } else {
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      await user.save();
    }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

exports.login = passport.authenticate('google', { 
  scope: [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid'
  ]
});
exports.callback = passport.authenticate('google', { failureRedirect: '/login' });

exports.callbackSuccess = (req, res) => {
  const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
};

exports.logout = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (user && user.accessToken) {
      await revokeToken(user.accessToken);
    }
    // Clear tokens in DB
    user.accessToken = null;
    user.refreshToken = null;
    await user.save();
    // Logout passport session
    req.logout();
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
};