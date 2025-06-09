import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './TaskModal.module.css';

const TaskModal = ({ task, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState(''); // New state for time

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setDueTime(task.dueTime || ''); // Set time if it exists
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
        alert("Title is required.");
        return;
    }
    // Include dueTime in the saved object
    onSave({ title, description, dueDate: dueDate || null, dueTime: dueTime || null });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>{task ? 'Edit Task' : 'Create a New Task'}</h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close modal">
            <X size={24} />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Description (Optional)</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3"></textarea>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className={styles.formGroup}>
              <label htmlFor="dueDate">Due Date</label>
              <input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="dueTime">Due Time</label>
              <input id="dueTime" type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} />
            </div>
          </div>
          <footer className={styles.footer}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>Cancel</button>
            <button type="submit" className={styles.saveButton}>Save Task</button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;