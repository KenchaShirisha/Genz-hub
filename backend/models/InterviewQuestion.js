const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express.js', 'Java', 'Python', 'C++', 'SQL']
  },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('InterviewQuestion', interviewQuestionSchema);
