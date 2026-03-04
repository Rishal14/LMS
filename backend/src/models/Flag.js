const mongoose = require('mongoose');

const flagSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    questionIndex: { type: Number, required: true },
    reason: { type: String, required: true, maxlength: 500 },
    status: { type: String, enum: ['PENDING', 'REVIEWED', 'DISMISSED'], default: 'PENDING' }
}, { timestamps: true });

// Prevent duplicate flags from same student on same question
flagSchema.index({ studentId: 1, quizId: 1, questionIndex: 1 }, { unique: true });

module.exports = mongoose.model('Flag', flagSchema);
