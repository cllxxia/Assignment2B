const express = require('express');
const router = express.Router();
const Achievement = require('../models/achievement');

router.get('/', async (req, res) => {
  const achievements = await Achievement.find({ completed: true }).limit(5);
  res.render('home', { achievements });
});

module.exports = router;
