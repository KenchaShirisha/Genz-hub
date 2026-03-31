const User = require('../models/User');

// @route GET /api/leaderboard
const getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find({}, 'name avatar progress.coding progress.quiz progress.interview')
      .lean();

    const ranked = users.map(u => ({
      id: u._id,
      name: u.name,
      avatar: u.avatar,
      codingPoints: u.progress?.coding?.points || 0,
      quizScore: u.progress?.quiz?.score || 0,
      interviewCompleted: u.progress?.interview?.completed || 0,
      totalScore: (u.progress?.coding?.points || 0) + (u.progress?.quiz?.score || 0) * 5 + (u.progress?.interview?.completed || 0) * 3
    })).sort((a, b) => b.totalScore - a.totalScore)
      .map((u, i) => ({ ...u, rank: i + 1 }));

    res.json({ success: true, leaderboard: ranked });
  } catch (err) { next(err); }
};

module.exports = { getLeaderboard };
