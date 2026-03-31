const CodingProblem = require('../models/CodingProblem');
const User = require('../models/User');

// @route GET /api/problems
const getProblems = async (req, res, next) => {
  try {
    const { category, difficulty, language, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (language) filter.supportedLanguages = language;
    if (search) filter.title = { $regex: search, $options: 'i' };
    const problems = await CodingProblem.find(filter);
    res.json({ success: true, count: problems.length, problems });
  } catch (err) { next(err); }
};

// @route GET /api/problems/:id
const getProblem = async (req, res, next) => {
  try {
    const problem = await CodingProblem.findById(req.params.id);
    if (!problem) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, problem });
  } catch (err) { next(err); }
};

// @route POST /api/problems/:id/submit
const submitSolution = async (req, res, next) => {
  try {
    const { language, code } = req.body;
    const problem = await CodingProblem.findById(req.params.id);
    if (!problem) return res.status(404).json({ success: false, message: 'Not found' });

    const user = await User.findById(req.user._id);
    const alreadySolved = user.solvedProblems.includes(req.params.id);

    if (!alreadySolved) {
      user.solvedProblems.push(req.params.id);
      user.progress.coding.solved += 1;
      user.progress.coding.points += problem.points;
      await user.save();
      // Emit real-time update
      req.app.get('io').to(req.user._id.toString()).emit('progressUpdate', user.progress);
    }

    // Mock run result
    res.json({
      success: true,
      result: { status: 'Accepted', runtime: `${Math.floor(Math.random() * 100) + 10}ms`, memory: `${Math.floor(Math.random() * 20) + 5}MB` },
      alreadySolved,
      progress: user.progress.coding
    });
  } catch (err) { next(err); }
};

// @route POST /api/problems (admin)
const createProblem = async (req, res, next) => {
  try {
    const problem = await CodingProblem.create(req.body);
    res.status(201).json({ success: true, problem });
  } catch (err) { next(err); }
};

module.exports = { getProblems, getProblem, submitSolution, createProblem };
