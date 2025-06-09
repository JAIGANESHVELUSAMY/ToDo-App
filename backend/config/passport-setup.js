const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

const findOrCreateUser = async (profile, provider, done) => {
    const email = profile.emails && (profile.emails.find(e => e.primary)?.value || profile.emails[0].value);
    if (!email) return done(new Error(`Could not retrieve email from ${provider.name}.`), false);
    try {
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            if (!user[provider.idField]) {
                user[provider.idField] = profile.id;
                await user.save();
            }
            return done(null, user);
        }
        const newUser = await new User({
            [provider.idField]: profile.id,
            displayName: profile.displayName || profile.username,
            email: email.toLowerCase(),
            image: profile.photos && profile.photos[0].value,
        }).save();
        done(null, newUser);
    } catch (error) { done(error, false); }
};

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:3001'}/auth/google/callback`,
}, (accessToken, refreshToken, profile, done) => findOrCreateUser(profile, { name: 'Google', idField: 'googleId' }, done)));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL || 'http://localhost:3001'}/auth/github/callback`,
    scope: ['user:email']
}, (accessToken, refreshToken, profile, done) => findOrCreateUser(profile, { name: 'GitHub', idField: 'githubId' }, done)));

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !user.password) return done(null, false, { message: 'Invalid credentials or social account used.' });
        const isMatch = await user.comparePassword(password);
        if (isMatch) return done(null, user);
        return done(null, false, { message: 'Incorrect password.' });
    } catch (error) { return done(error); }
}));
