const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

transporter.verify(function(error) {
  if (error) console.error("❌ Nodemailer configuration error:", error);
  else console.log("✅ Nodemailer is configured correctly for sending reminders.");
});

const sendReminderEmail = async (to, task) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: to,
        subject: `Reminder: Your task "${task.title}" is due soon!`,
        html: `<p>Hi there, this is a reminder that your task, <strong>${task.title}</strong>, is due at ${task.dueTime} on ${new Date(task.dueDate).toLocaleDateString()}.</p>`,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Reminder email sent to ${to} for task "${task.title}"`);
    } catch (error) {
        console.error(`Failed to send reminder to ${to}:`, error);
    }
};

module.exports = { sendReminderEmail };