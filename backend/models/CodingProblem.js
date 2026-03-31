const mongoose = require('mongoose');

const codingProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['Arrays', 'Strings', 'LinkedList', 'Trees', 'DP', 'Sorting', 'DBMS', 'Graphs', 'Math'] },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  supportedLanguages: [{ type: String, enum: ['Java', 'Python', 'JavaScript', 'C++', 'SQL'] }],
  starterCode: {
    Java: { type: String, default: '' },
    Python: { type: String, default: '' },
    JavaScript: { type: String, default: '' },
    'C++': { type: String, default: '' },
    SQL: { type: String, default: '' }
  },
  examples: [{ input: String, output: String, explanation: String }],
  constraints: [String],
  points: { type: Number, default: 10 }
}, { timestamps: true });

module.exports = mongoose.model('CodingProblem', codingProblemSchema);
