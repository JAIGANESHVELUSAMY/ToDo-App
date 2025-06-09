const router = require('express').Router();
const Task = require('../models/Task');
const authenticate = require('../middleware/authenticate');

// This applies the authenticate middleware to ALL routes in this file
router.use(authenticate);

// --- GET ALL TASKS ---
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});

// --- CREATE A NEW TASK (DEFINITIVELY FIXED) ---
router.post('/', async (req, res) => {
    try {
        const { title, description, dueDate, dueTime } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        
        // The user ID comes directly from the decoded token via the middleware
        const userId = req.user.id;

        const newTask = new Task({ 
            title, 
            description, 
            dueDate: dueDate || null,
            dueTime: dueTime || null,
            user: userId 
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        console.error('Error in POST /api/tasks:', err);
        res.status(500).json({ message: 'Server error while creating task.' });
    }
});

// --- UPDATE A TASK ---
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) return res.status(404).json({ message: 'Task not found or you do not have permission.' });
        
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: 'Error updating task' });
    }
});

// --- DELETE A TASK ---
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) return res.status(404).json({ message: 'Task not found or you do not have permission.' });
        
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting task' });
    }
});

module.exports = router;