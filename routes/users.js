const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
const bcrypt = require('bcryptjs');

// Register
router.get('/register', (req, res) => res.render('users/register'));

router.post('/register', async (req, res) => {
  const { username, email, password, password2 } = req.body;
  let errors = [];

  // Password match check
  if(password !== password2) errors.push({ msg: "Passwords do not match" });

  if(errors.length > 0) {
    return res.render('users/register', { errors, username, email });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if(userExists) {
      return res.render('users/register', {
        errors: [{ msg: "Email already registered" }],
        username,
        email
      });
    }

    // Create and save user
    const newUser = new User({ username, email, password });
    await newUser.save();

    req.flash('success_msg', 'You are now registered and can log in');
    res.redirect('/users/login');
  } catch (err) {
    console.log('Error registering user:', err);
    req.flash('error_msg', 'Something went wrong. Please try again.');
    res.redirect('/users/register');
  }
});

// Login
router.get('/login', (req, res) => res.render('users/login'));

router.post('/login', passport.authenticate('local', {
  successRedirect: '/achievements/dashboard',
  failureRedirect: '/users/login',
  failureFlash: true
}));

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
});

module.exports = router;
