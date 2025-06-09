import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import styles from './Login.module.css';
import { Mail, Lock, User, Github } from 'lucide-react';

const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ displayName: '', email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSocialLogin = (provider) => window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isRegister ? '/auth/register' : '/auth/login';
        try {
            const { data } = await api.post(endpoint, formData);
            if (isRegister) sessionStorage.setItem('signup_success', 'true');
            login(data.token);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <div className={styles.container}><div className={styles.card}>
            <div className={styles.header}><h1>TaskMaster</h1><p>{isRegister ? 'Create an account' : 'Sign in to your account'}</p></div>
            <div style={{display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem'}}>
                <button onClick={() => setIsRegister(false)} style={{width: '50%', padding: '0.75rem', fontWeight: !isRegister ? '700' : '500', color: !isRegister ? 'var(--primary-color)' : 'inherit', borderBottom: !isRegister ? '2px solid var(--primary-color)' : '2px solid transparent', background: 'none', border: 'none', cursor: 'pointer'}}>Sign In</button>
                <button onClick={() => setIsRegister(true)} style={{width: '50%', padding: '0.75rem', fontWeight: isRegister ? '700' : '500', color: isRegister ? 'var(--primary-color)' : 'inherit', borderBottom: isRegister ? '2px solid var(--primary-color)' : '2px solid transparent', background: 'none', border: 'none', cursor: 'pointer'}}>Sign Up</button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <form onSubmit={handleSubmit} className={styles.form}>
                {isRegister && <div className={styles.inputWrapper}><User size={20}/><input type="text" name="displayName" placeholder="Full Name" onChange={handleChange} required className={styles.input}/></div>}
                <div className={styles.inputWrapper}><Mail size={20}/><input type="email" name="email" placeholder="Email Address" onChange={handleChange} required className={styles.input}/></div>
                <div className={styles.inputWrapper}><Lock size={20}/><input type="password" name="password" placeholder="Password" onChange={handleChange} required className={styles.input}/></div>
                <button type="submit" className={styles.submitButton}>{isRegister ? 'Create Account' : 'Sign In'}</button>
            </form>
            <div className={styles.separator}><span>OR</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button onClick={() => handleSocialLogin('google')} className={styles.socialButton}><svg width="20" height="20" viewBox="0 0 48 48"><path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/></svg>Continue with Google</button>
                <button onClick={() => handleSocialLogin('github')} className={styles.socialButton}><Github size={20}/>Continue with GitHub</button>
            </div>
        </div></div>
    );
};
export default Login;