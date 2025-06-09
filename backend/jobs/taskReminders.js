const cron = require('node-cron');
const Task = require('../models/task');
const User = require('../models/User');
const { sendReminderEmail } = require('../services/emailService');

// Runs every minute
cron.schedule('* * * * *', async () => {
    console.log('Running task reminder check...');
    
    const now = new Date();
    // Set a window for reminders, e.g., tasks due in the next 15 to 16 minutes
    const reminderWindowStart = new Date(now.getTime() + 14 * 60 * 1000);
    const reminderWindowEnd = new Date(now.getTime() + 15 * 60 * 1000);

    try {
        const upcomingTasks = await Task.find({ status: 'Open' }).populate('user');

        for (const task of upcomingTasks) {
            if (task.dueDate && task.dueTime) {
                const fullDueDate = new Date(`${task.dueDate.toISOString().split('T')[0]}T${task.dueTime}`);
                if (fullDueDate >= reminderWindowStart && fullDueDate <= reminderWindowEnd) {
                    if (task.user && task.user.email) {
                        await sendReminderEmail(task.user.email, task);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error running reminder job:', error);
    }
});