import React from 'react';
import { Edit, Trash2, Calendar, CheckCircle, Circle, Clock } from 'lucide-react';
import styles from './TaskItem.module.css';

const TaskItem = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const isCompleted = task.status === 'Completed';
  // Combine date and time for a full Date object if both exist
  const fullDueDate = task.dueDate && task.dueTime ? new Date(`${task.dueDate.split('T')[0]}T${task.dueTime}`) : (task.dueDate ? new Date(task.dueDate) : null);
  const isOverdue = !isCompleted && fullDueDate && fullDueDate < new Date();

  const taskItemClasses = `${styles.taskItem} ${isCompleted ? styles.completed : ''}`;
  const titleClasses = `${styles.title} ${isCompleted ? styles.titleCompleted : ''}`;
  const dueDateClasses = `${styles.dueDate} ${isOverdue ? styles.overdue : ''}`;

  return (
    <div className={taskItemClasses}>
      <div className={styles.mainContent}>
        <button onClick={onToggleStatus} className={`${styles.toggleButton} ${isCompleted ? styles.completed : styles.open}`} aria-label={isCompleted ? "Mark as open" : "Mark as complete"}>
          {isCompleted ? <CheckCircle size={22} /> : <Circle size={22} />}
        </button>
        <div className={styles.details}>
          <p className={titleClasses}>{task.title}</p>
          {task.dueDate && (
            <div className={dueDateClasses}>
              <Calendar size={12} />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              {task.dueTime && (
                <>
                  <Clock size={12} style={{ marginLeft: '0.5rem' }}/>
                  <span>{task.dueTime}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={styles.actions}>
        <button onClick={onEdit} className={styles.actionButton} aria-label="Edit task"><Edit size={16} /></button>
        <button onClick={onDelete} className={`${styles.actionButton} ${styles.delete}`} aria-label="Delete task"><Trash2 size={16} /></button>
      </div>
    </div>
  );
};

export default TaskItem;