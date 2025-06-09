import React, { useState, useEffect, useMemo } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/api';
import Navbar from '../components/Navbar';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';
import NotificationPopup from '../components/NotificationPopup';
import { Plus } from 'lucide-react';
import styles from './Dashboard.module.css';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, postLoginMessage, setPostLoginMessage } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        const doFetchTasks = async () => {
            if (!user) return;
            try { setLoading(true); const { data } = await getTasks(); setTasks(data); } 
            catch (err) { setError('Failed to fetch tasks.'); } 
            finally { setLoading(false); }
        };
        doFetchTasks();
        if (postLoginMessage) {
            setNotification(postLoginMessage);
            setPostLoginMessage(null);
        }
    }, [user, postLoginMessage, setPostLoginMessage]);

    useEffect(() => {
        const checkReminders = () => {
            tasks.forEach(task => {
                if (task.status === 'Open' && task.dueDate && task.dueTime) {
                    const fullDueDate = new Date(`${task.dueDate.split('T')[0]}T${task.dueTime}`);
                    const minutesUntilDue = (fullDueDate.getTime() - new Date().getTime()) / 60000;
                    if (minutesUntilDue > 0 && minutesUntilDue <= 10) {
                        const notificationShown = sessionStorage.getItem(`notif_${task._id}`);
                        if (!notificationShown) {
                            setNotification({ title: 'Task Reminder', message: `Your task "${task.title}" is due in about ${Math.round(minutesUntilDue)} minutes!` });
                            sessionStorage.setItem(`notif_${task._id}`, 'true');
                        }
                    }
                }
            });
        };
        const intervalId = setInterval(checkReminders, 60000);
        return () => clearInterval(intervalId);
    }, [tasks]);

    const handleOpenModal = (task = null) => { setEditingTask(task); setIsModalOpen(true); };
    const handleCloseModal = () => { setEditingTask(null); setIsModalOpen(false); };
    const handleSaveTask = async (taskData) => {
        try {
            if (editingTask) {
                const { data } = await updateTask(editingTask._id, taskData);
                setTasks(p => p.map(t => t._id === editingTask._id ? data : t));
            } else {
                const { data } = await createTask(taskData);
                setTasks(p => [data, ...p]);
            }
            handleCloseModal();
        } catch (err) { alert('Error: Could not save the task.'); }
    };
    const handleDeleteTask = async (id) => {
        if (window.confirm('Delete this task?')) {
            try { await deleteTask(id); setTasks(p => p.filter(t => t._id !== id)); } 
            catch (err) { alert('Error: Could not delete the task.'); }
        }
    };
    const handleToggleStatus = async (task) => {
        try {
            const { data } = await updateTask(task._id, { status: task.status === 'Open' ? 'Completed' : 'Open' });
            setTasks(p => p.map(t => t._id === task._id ? data : t));
        } catch (err) { alert('Error: Could not update task status.'); }
    };

    const openTasks = useMemo(() => tasks.filter(t => t.status === 'Open').sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt)), [tasks]);
    const completedTasks = useMemo(() => tasks.filter(t => t.status === 'Completed').sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)), [tasks]);

    return (
        <div><Navbar /><main className={styles.container}>
            <header className={styles.header}><h1>My Tasks</h1><button onClick={() => handleOpenModal()} className={styles.addTaskButton}><Plus size={20} />Add Task</button></header>
            {loading ? <p className={styles.emptyMessage}>Loading tasks...</p> : error ? <p className={styles.error}>{error}</p> :
            <div className={styles.grid}>
                <div className={styles.column}><h2>To Do ({openTasks.length})</h2><div className={styles.tasksContainer}>
                    {openTasks.length > 0 ? openTasks.map(task => <TaskItem key={task._id} task={task} onEdit={() => handleOpenModal(task)} onDelete={() => handleDeleteTask(task._id)} onToggleStatus={() => handleToggleStatus(task)} />) : <p className={styles.emptyMessage}>No open tasks!</p>}
                </div></div>
                <div className={styles.column}><h2>Completed ({completedTasks.length})</h2><div className={styles.tasksContainer}>
                    {completedTasks.length > 0 ? completedTasks.map(task => <TaskItem key={task._id} task={task} onEdit={() => handleOpenModal(task)} onDelete={() => handleDeleteTask(task._id)} onToggleStatus={() => handleToggleStatus(task)} />) : <p className={styles.emptyMessage}>No completed tasks.</p>}
                </div></div>
            </div>}
        </main>{isModalOpen && <TaskModal task={editingTask} onClose={handleCloseModal} onSave={handleSaveTask} />}
        {notification && <NotificationPopup title={notification.title} message={notification.message} onClose={() => setNotification(null)}/>}</div>
    );
};
export default Dashboard;