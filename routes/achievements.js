const express = require('express');
const router = express.Router();
const Achievement = require('../models/achievement');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash('error_msg', 'Please log in to view that resource');
  res.redirect('/users/login');
}

// Redirect /achievements -> /achievements/dashboard
router.get('/', ensureAuthenticated, (req, res) => {
  res.redirect('/achievements/dashboard');
});

// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  const achievements = await Achievement.find({ user: req.user.id });

  // Progress data for Chart.js
  const games = [...new Set(achievements.map(a => a.game))];
  const completionData = games.map(game => {
    const gameAchievements = achievements.filter(a => a.game === game);
    const completed = gameAchievements.filter(a => a.completed).length;
    return Math.round((completed / gameAchievements.length) * 100);
  });

  res.render('achievements/dashboard', { achievements, games, completionData });
});

// Add Achievement
router.get('/add', ensureAuthenticated, (req, res) => res.render('achievements/add'));
router.post('/add', ensureAuthenticated, async (req, res) => {
  const { title, game, description } = req.body;
  await Achievement.create({ title, game, description, user: req.user.id });
  req.flash('success_msg', 'Achievement added');
  res.redirect('/achievements/dashboard');
});

// Edit Achievement
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
  const achievement = await Achievement.findById(req.params.id);
  res.render('achievements/edit', { achievement });
});
router.put('/edit/:id', ensureAuthenticated, async (req, res) => {
  const { title, game, description, completed } = req.body;
  await Achievement.findByIdAndUpdate(req.params.id, {
    title,
    game,
    description,
    completed: completed === 'on'
  });
  req.flash('success_msg', 'Achievement updated');
  res.redirect('/achievements/dashboard');
});

// Delete Achievement
router.delete('/delete/:id', ensureAuthenticated, async (req, res) => {
  await Achievement.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Achievement deleted');
  res.redirect('/achievements/dashboard');
});

module.exports = router;
