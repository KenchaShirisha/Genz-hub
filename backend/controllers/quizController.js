const Quiz = require('../models/Quiz');
const User = require('../models/User');

// @route GET /api/quiz
const getQuestions = async (req, res, next) => {
  try {
    const { category, limit = 10 } = req.query;
    const filter = category ? { category } : {};
    const questions = await Quiz.aggregate([{ $match: filter }, { $sample: { size: parseInt(limit) } }]);
    // Remove correct answer from response
    const sanitized = questions.map(({ correctAnswer, ...q }) => q);
    res.json({ success: true, questions: sanitized });
  } catch (err) { next(err); }
};

// @route POST /api/quiz/submit
const submitQuiz = async (req, res, next) => {
  try {
    const { answers } = req.body; // [{ questionId, selectedOption }]
    let score = 0;
    const results = [];

    for (const ans of answers) {
      const q = await Quiz.findById(ans.questionId);
      if (!q) continue;
      const correct = q.correctAnswer === ans.selectedOption;
      if (correct) score++;
      results.push({ questionId: ans.questionId, correct, correctAnswer: q.correctAnswer, explanation: q.explanation });
    }

    const user = await User.findById(req.user._id);
    user.progress.quiz.attempted += answers.length;
    user.progress.quiz.score += score;
    await user.save();

    res.json({ success: true, score, total: answers.length, results, progress: user.progress.quiz });
  } catch (err) { next(err); }
};

module.exports = { getQuestions, submitQuiz };
