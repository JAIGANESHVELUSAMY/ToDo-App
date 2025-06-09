const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    status: { type: String, enum: ['Open', 'Completed'], default: 'Open' },
    dueDate: { type: Date },
    dueTime: { type: String },
}, { timestamps: true });
module.exports = mongoose.model('Task', taskSchema);