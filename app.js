const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');

// DB config
require('./config/database');
require('./config/passport')(passport);

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));

// Method override
app.use(methodOverride('_method'));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash());

// Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const hbs = require('hbs');
hbs.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/achievements', require('./routes/achievements'));

// Cron jobs
const { dailyReminder, weeklySummary } = require('./utils/reminders');
dailyReminder.start();
weeklySummary.start();

// Export app for bin/www
module.exports = app;
