const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const InterviewQuestion = require('../models/InterviewQuestion');
const CodingProblem = require('../models/CodingProblem');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

const q1 = require('./interviewQuestions1');
const q2 = require('./interviewQuestions2');
const q3 = require('./interviewQuestions3');
const codingProblems = require('./codingProblems');
const quizQuestions = require('./quizQuestions');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected');

    // Clear existing
    await InterviewQuestion.deleteMany();
    await CodingProblem.deleteMany();
    await Quiz.deleteMany();
    console.log('Cleared existing data');

    // Seed interview questions
    const allQuestions = [...q1, ...q2, ...q3];
    await InterviewQuestion.insertMany(allQuestions);
    console.log(`Seeded ${allQuestions.length} interview questions`);

    // Seed coding problems
    await CodingProblem.insertMany(codingProblems);
    console.log(`Seeded ${codingProblems.length} coding problems`);

    // Seed quiz questions
    await Quiz.insertMany(quizQuestions);
    console.log(`Seeded ${quizQuestions.length} quiz questions`);

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
};

seed();
