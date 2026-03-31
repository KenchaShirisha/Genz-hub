const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  category: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // index of correct option
  explanation: { type: String, default: '' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
