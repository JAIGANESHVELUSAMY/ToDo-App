import React from 'react';
import { Bell } from 'lucide-react';
import styles from './NotificationPopup.module.css';

const NotificationPopup = ({ title, message, onClose }) => {
  // We stop the click from propagating to the overlay behind it
  const handlePopupClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
        <div className={styles.popup} onClick={handlePopupClick}>
            <div className={styles.icon}>
                <Bell size={32} />
            </div>
            <div className={styles.content}>
                <h4>{title}</h4>
                <p>{message}</p>
            </div>
            <button onClick={onClose} className={styles.closeButton}>
                Dismiss
            </button>
        </div>
    </div>
  );
};

export default NotificationPopup;