const express = require('express');
const router = express.Router();
const { getAll, getByCategory, getById, bookmark, markComplete, getRandom } = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAll);
router.get('/random', protect, getRandom);
router.get('/:category', protect, getByCategory);
router.get('/question/:id', protect, getById);
router.post('/bookmark', protect, bookmark);
router.post('/complete', protect, markComplete);

module.exports = router;
