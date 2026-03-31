const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  progress: {
    coding: { solved: { type: Number, default: 0 }, points: { type: Number, default: 0 } },
    quiz: { attempted: { type: Number, default: 0 }, score: { type: Number, default: 0 } },
    interview: { completed: { type: Number, default: 0 }, categories: { type: Map, of: Number, default: {} } },
    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now }
  },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InterviewQuestion' }],
  notes: [{ title: String, content: String, createdAt: { type: Date, default: Date.now } }],
  solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CodingProblem' }]
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
