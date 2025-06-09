import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Sun, Moon } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <h1 className={styles.brand}>TaskMaster</h1>
                <div className={styles.controls}>
                    <button onClick={toggleTheme} className={styles.themeButton} aria-label="Toggle theme">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    {user && (
                        <div className={styles.profile}>
                            <img src={user.image || `https://ui-avatars.com/api/?name=${user.displayName}&background=3b82f6&color=fff`} alt={user.displayName} className={styles.profileImage} />
                            <span className={styles.displayName}>{user.displayName}</span>
                        </div>
                    )}
                    <button onClick={logout} className={styles.logoutButton}>
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;