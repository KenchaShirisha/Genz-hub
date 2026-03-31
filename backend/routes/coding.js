const express = require('express');
const router = express.Router();
const { getProblems, getProblem, submitSolution, createProblem } = require('../controllers/codingController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getProblems);
router.get('/:id', protect, getProblem);
router.post('/', protect, createProblem);
router.post('/:id/submit', protect, submitSolution);

module.exports = router;
