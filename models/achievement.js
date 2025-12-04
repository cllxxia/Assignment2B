const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  game: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  dateAdded: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.models.Achievement || mongoose.model('Achievement', achievementSchema);


