const cron = require('node-cron');
const Achievement = require('../models/achievement');
const User = require('../models/user');

// Daily reminder at 9 AM
const dailyReminder = cron.schedule('0 9 * * *', async () => {
  try {
    const users = await User.find();
    for (const user of users) {
      const incomplete = await Achievement.find({ user: user._id, completed: false });
      
      if (incomplete.length > 0) {
        console.log(`Reminder for ${user.username}: You have ${incomplete.length} incomplete achievements!`);
      }
    }
  } catch (err) {
    console.error('Daily reminder error:', err);
  }
}, { scheduled: false });

// Weekly summary every Monday at 10 AM
const weeklySummary = cron.schedule('0 10 * * 1', async () => {
  try {
    const users = await User.find();
    for (const user of users) {
      const achievements = await Achievement.find({ user: user._id });
      const completed = achievements.filter(a => a.completed).length;

      console.log(
        `Weekly summary for ${user.username}: Completed ${completed}/${achievements.length} achievements.`
      );
    }
  } catch (err) {
    console.error('Weekly summary error:', err);
  }
}, { scheduled: false });

module.exports = { dailyReminder, weeklySummary };
