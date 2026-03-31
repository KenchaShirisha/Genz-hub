const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadAvatar, addNote, deleteNote } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.put('/update', protect, updateProfile);
router.post('/avatar', protect, uploadAvatar);
router.post('/notes', protect, addNote);
router.delete('/notes/:noteId', protect, deleteNote);

module.exports = router;
