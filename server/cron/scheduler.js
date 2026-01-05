const cron = require('node-cron');
const Post = require('../models/post');

// Runs every minute
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();

    const posts = await Post.find({
      scheduledAt: { $lte: now },
      status: 'scheduled'
    });

    for (const post of posts) {
      console.log('📤 Publishing post:', post._id);

      // TODO: integrate social APIs here

      post.status = 'published';
      post.publishedAt = new Date();
      await post.save();
    }
  } catch (err) {
    console.error('❌ Scheduler error:', err);
  }
});

console.log('🕒 Scheduler started');
