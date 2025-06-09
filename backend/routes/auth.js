const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- SIMPLIFIED AND RELIABLE TOKEN CREATION ---
const createToken = (user) => {
    // The payload should be minimal. The user's ID is all that's needed.
    const payload = { id: user._id };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const socialRedirect = (req, res) => {
    const token = createToken(req.user);
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
};

// Social Login Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/', session: false }), socialRedirect);
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/', session: false }), socialRedirect);


// Email & Password Routes
router.post('/register', async (req, res) => {
    try {
        const { displayName, email, password } = req.body;
        if (!displayName || !email || !password) return res.status(400).json({ message: 'All fields are required.' });
        
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) return res.status(400).json({ message: 'An account with this email already exists.' });
        
        const newUser = new User({ displayName, email, password });
        await newUser.save();
        
        const token = createToken(newUser);
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
        
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !user.password) return res.status(401).json({ message: 'Invalid credentials.' });
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials.' });
        
        const token = createToken(user);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login.' });
    }
});

module.exports = router;