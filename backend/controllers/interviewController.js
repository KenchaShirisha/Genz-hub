const InterviewQuestion = require('../models/InterviewQuestion');
const User = require('../models/User');

// @route GET /api/interview
const getAll = async (req, res, next) => {
  try {
    const { category, difficulty, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (search) filter.question = { $regex: search, $options: 'i' };
    const questions = await InterviewQuestion.find(filter);
    res.json({ success: true, count: questions.length, questions });
  } catch (err) { next(err); }
};

// @route GET /api/interview/:category
const getByCategory = async (req, res, next) => {
  try {
    const questions = await InterviewQuestion.find({ category: req.params.category });
    res.json({ success: true, count: questions.length, questions });
  } catch (err) { next(err); }
};

// @route GET /api/interview/question/:id
const getById = async (req, res, next) => {
  try {
    const question = await InterviewQuestion.findById(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, question });
  } catch (err) { next(err); }
};

// @route POST /api/interview/bookmark
const bookmark = async (req, res, next) => {
  try {
    const { questionId } = req.body;
    const user = await User.findById(req.user._id);
    const idx = user.bookmarks.indexOf(questionId);
    if (idx > -1) user.bookmarks.splice(idx, 1);
    else user.bookmarks.push(questionId);
    await user.save();
    res.json({ success: true, bookmarks: user.bookmarks });
  } catch (err) { next(err); }
};

// @route POST /api/interview/complete
const markComplete = async (req, res, next) => {
  try {
    const { category } = req.body;
    const user = await User.findById(req.user._id);
    user.progress.interview.completed += 1;
    const current = user.progress.interview.categories.get(category) || 0;
    user.progress.interview.categories.set(category, current + 1);
    await user.save();
    res.json({ success: true, progress: user.progress.interview });
  } catch (err) { next(err); }
};

// @route GET /api/interview/random
const getRandom = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const count = await InterviewQuestion.countDocuments(filter);
    const random = Math.floor(Math.random() * count);
    const question = await InterviewQuestion.findOne(filter).skip(random);
    res.json({ success: true, question });
  } catch (err) { next(err); }
};

module.exports = { getAll, getByCategory, getById, bookmark, markComplete, getRandom };
