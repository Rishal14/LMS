const Flag = require('../models/Flag');
const Quiz = require('../models/Quiz');

// @desc    Flag a quiz question
// @route   POST /api/flags
// @access  Private/Student
const createFlag = async (req, res) => {
    try {
        const { quizId, questionIndex, reason } = req.body;

        if (!quizId || questionIndex === undefined || !reason) {
            return res.status(400).json({ message: 'quizId, questionIndex, and reason are required' });
        }

        // Verify quiz exists and questionIndex is valid
        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        if (questionIndex < 0 || questionIndex >= quiz.questions.length) {
            return res.status(400).json({ message: 'Invalid question index' });
        }

        const flag = await Flag.create({
            studentId: req.user.id,
            quizId,
            questionIndex,
            reason
        });

        res.status(201).json({ message: 'Question flagged successfully', flag });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'You have already flagged this question' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get flags for quizzes created by the logged-in instructor
// @route   GET /api/flags
// @access  Private/Instructor
const getFlags = async (req, res) => {
    try {
        // Find quizzes created by this instructor
        const myQuizIds = await Quiz.find({ createdBy: req.user.id }).select('_id');
        const quizIds = myQuizIds.map(q => q._id);

        const flags = await Flag.find({ quizId: { $in: quizIds } })
            .populate('studentId', 'name email')
            .populate('quizId', 'title questions')
            .sort({ createdAt: -1 });

        res.json(flags);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createFlag, getFlags };
