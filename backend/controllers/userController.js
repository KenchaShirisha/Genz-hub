const User = require('../models/User');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
  /image/.test(file.mimetype) ? cb(null, true) : cb(new Error('Images only'));
}});

// @route GET /api/user/profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarks').select('-password');
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

// @route PUT /api/user/update
const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name }, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) { next(err); }
};

// @route POST /api/user/avatar
const uploadAvatar = [upload.single('avatar'), async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: `/uploads/${req.file.filename}` }, { new: true }).select('-password');
    res.json({ success: true, avatar: user.avatar });
  } catch (err) { next(err); }
}];

// @route POST /api/user/notes
const addNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const user = await User.findById(req.user._id);
    user.notes.push({ title, content });
    await user.save();
    res.json({ success: true, notes: user.notes });
  } catch (err) { next(err); }
};

// @route DELETE /api/user/notes/:noteId
const deleteNote = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.notes = user.notes.filter(n => n._id.toString() !== req.params.noteId);
    await user.save();
    res.json({ success: true, notes: user.notes });
  } catch (err) { next(err); }
};

module.exports = { getProfile, updateProfile, uploadAvatar, addNote, deleteNote };
